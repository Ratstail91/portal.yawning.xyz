const fs = require('fs');
const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const isEmail = require('isemail');
const mysql = require('mysql');
const sendmail = require('sendmail')();
const {SELF, FRIEND, GROUP, BLOCKED} = require('./consts');
const {getMeme, getRelationLevel} = require('./utils');

const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}));

// Parse application/json
app.use(bodyParser.json());

// Db connections
const db = mysql.createConnection({
	host: 'localhost',
	user: 'node',
	password: process.env.MYSQL_PASSWORD || fs.readFileSync('../node.pwd', 'utf8').replace(/^\s+|\s+$/g, '')
});

db.connect(err => {
	if (err) {
		throw err;
	}
	db.query('use yawning;', err => {
		if (err) {
			throw err;
		}
	});
	console.info('connected to mysql');
});

// Static directories
app.use('/avatars', express.static(path.resolve(__dirname, './public_html/avatars')));
app.use('/node_modules', express.static(path.resolve(__dirname, './public_html/node_modules')));
app.use('/styles', express.static(path.resolve(__dirname, './public_html/styles')));

// Handle messages
app.post('/signup', (req, res, next) => {
  // Valid email and password
	if (!isEmail.validate(req.body.email) || req.body.password.length < 8 || req.body.password !== req.body.retype) {
		res.write('<html><body><img src="' + getMeme('hackerman') + '" /></body></html>');
		res.end();
		return;
	}

  // Check if the email already exists
	db.query('SELECT COUNT(*) FROM profiles WHERE email = ?', [req.body.email], (err, results) => {
		if (err) {
			return next(err);
		}

		if (results[0][Object.keys(results[0])[0]] !== 0) {
			res.write('<html><body><p>Email Already Exists</p></body></html>');
			res.end();
			return;
		}

    // Gen salt, hash
		bcrypt.genSalt(11, (err, salt) => {
			if (err) {
				return next(err);
			}

			bcrypt.hash(req.body.password, salt, (err, hash) => {
				if (err) {
					next(err);
				}

        // Store the email, salt & hash
				const rand = Math.floor(Math.random() * 65535);
				const query = 'REPLACE INTO signups (email, salt, hash, verify) VALUES (?, ?, ?, ?)';

				db.query(query, [req.body.email, salt, hash, rand], err => {
					if (err) {
						return next(err);
					}

          // Send the verification email
					const addr = 'https://portal.yawning.xyz/verify?email=' + req.body.email + '&verify=' + rand;
					const msg = 'Hello! Please visit the following address to verify your email: ';
					const msgHtml = '<html><body><p>' + msg + '<a href="' + addr + '">' + addr + '</a></p></body></html>';

					sendmail({
						from: 'signup@portal.yawning.com',
						to: req.body.email,
						subject: 'email verification',
						text: msg + addr,
						html: msgHtml
					}, err => {
						if (err) {
							res.write('<html><body><p>An Unknown Error Occured (did you use a valid email?).</p><p>' + err + '</p></body></html>');
							res.end();
							return;
						}
						res.write('<html><body><p>Verification Email Sent</p></body></html>');
						res.end();
					});
				});
			});
		});
	});
});

// Accessable via email
app.get('/verify', (req, res, next) => {
	const query = 'SELECT email, hash, salt, verify FROM signups WHERE email = ?';
	db.query(query, [req.query.email], (err, results) => {
		if (err) {
			return next(err);
		}

		if (results.length !== 1) {
			res.write('<html><body><p>That username does not exist or this link has already been used.</p></body></html>');
			res.end();
			return;
		}

		if (req.query.verify !== results[0].verify) {
			res.write('<html><body><p>Verification Failed!</p></body></html>');
			res.end();
			return;
		}

    // Move the data from signups to profiles
		const query = 'INSERT INTO profiles (email, hash, salt) VALUES (?, ?, ?);';
		db.query(query, [results[0].email, results[0].hash, results[0].salt], err => {
			if (err) {
				return next(err);
			}

			db.query('DELETE FROM signups WHERE email = ?', [results[0].email], err => {
				if (err) {
					return next(err);
				}

				res.write('<html><body><p>Verification Succeeded!</p></body></html>');
				res.end();
			});
		});
	});
});

app.post('/login', (req, res, next) => {
  // Valid email and password
	if (!isEmail.validate(req.body.email) || req.body.password.length < 8) {
		res.status(400).write('<img src="' + getMeme('hackerman') + '" />');
		res.end();
		return;
	}

  // Find this email's information
	db.query('SELECT id, salt, hash FROM profiles WHERE email = ?', [req.body.email], (err, results) => {
		if (err) {
			return next(err);
		}

		if (results.length === 0) {
			res.status(400).write('Incorrect email or password');
			res.end();
			return;
		}

    // Gen a new hash hash
		bcrypt.hash(req.body.password, results[0].salt, (err, hash) => {
			if (err) {
				return next(err);
			}

      // Compare the calculated hash to the stored hash
			if (hash !== results[0].hash) {
				res.status(400).write('Incorrect email or password');
				res.end();
				return;
			}

      // Create and store the login token
			const rand = Math.floor(Math.random() * 65535);

      // @TODO: allow multiple login sources
			const query = 'UPDATE profiles SET lastToken= ?  WHERE email = ?';

			db.query(query, [rand, req.body.email], err => {
				if (err) {
					return next(err);
				}

        // Send the JSON containing the email and token
				res.status(200).json({
					id: results[0].id,
					token: rand
				});
				res.end();
			});
		});
	});
});

app.post('/passwordrecovery', (req, res) => {
	res.write('<p>Coming Soon</p>');
	res.end();
});

app.post('/requestprofile', (req, res, next) => {
  // Get the requester's relation level
  // (SELF, FRIEND, GROUP, PUBLIC, BLOCKED)
	getRelationLevel(db, req.body.id, req.body.token, req.body.profileId, (err, relationLevel) => {
		if (err === 404 || relationLevel === BLOCKED) {
			console.log(err === 404 ? 'missing profile' : 'blocked profile', req.body.id, req.body.profileId);
			res.status(404);
			res.end();
			return;
		}
		if (err === 'id and token don\'t match') {
			console.log(err, req.body.id, req.body.token);
      // @TODO: fix this
			res.status(400).send(err + ' (Are you logged in somewhere else? Try logging out and back in.)');
			res.end();
			return;
		}
		if (err) {
			return next(err);
		}

    // Get the userId's information
		const query = 'SELECT email, avatar, username, realname, biography FROM profiles WHERE id = ?';
		db.query(query, [req.body.profileId], (err, profileResults) => {
			if (err) {
				return next(err);
			}

      // Get the userId's visibility settings
			const query = 'SELECT visibleProfile, visibleEmail, visibleAvatar, visibleUsername, visibleRealname, visibleBiography FROM profiles WHERE id = ?';
			db.query(query, [req.body.profileId], (err, visibilityResults) => {
				if (err) {
					return next(err);
				}

        // Determine what to add to the return message
				const pack = function (field, visible) {
          // Console.log(field, visible);
          // can see
					if (visible === 'all' || relationLevel === SELF) {
						return field;
					}
          // Friends & up
					if (visible === 'friends' && relationLevel >= FRIEND) {
						return field;
					}
          // Groups & up
					if (visible === 'groups' && relationLevel >= GROUP) {
						return field;
					}
          // No one can see
					return undefined;
				};

        // Check if profile is visible
				if (pack(true, visibilityResults[0].visibleProfile) !== true) {
					console.log('private profile');
					res.status(404);
					res.end();
					return;
				}

				const json = {
					email: pack(profileResults[0].email, visibilityResults[0].visibleEmail),
					avatar: pack(profileResults[0].avatar, visibilityResults[0].visibleAvatar),
					username: pack(profileResults[0].username, visibilityResults[0].visibleUsername),
					realname: pack(profileResults[0].realname, visibilityResults[0].visibleRealname),
					biography: pack(profileResults[0].biography, visibilityResults[0].visibleBiography)
				};

				res.end(JSON.stringify(json));
			});
		});
	});
});

app.post('/updateprofile', (req, res, next) => {
	const query = 'SELECT lastToken FROM profiles WHERE id = ?';
	db.query(query, [req.body.id], (err, queryResults) => {
		if (err) {
			return next(err);
		}

    // Hack check
		if (queryResults.length !== 1 || queryResults[0].lastToken !== req.body.token) {
			console.log('Hacking attempt against profile: ' + req.body.id);
			res.status(400).write('<img src="' + getMeme('hackerman') + '" />');
			res.end();
			return;
		}

    // Create the update system
		let fieldCount = 0;
		let query = 'UPDATE profiles SET ';
		const update = function (name, value) {
			if (value !== undefined) {
				if (fieldCount > 0) {
					query += ', ';
				}
				query += name + ' = \'' + value + '\' ';
				fieldCount += 1;
			}
		};

    // Add to the query
    // update('email', req.body.email);
		update('avatar', req.body.avatar);
		update('username', req.body.username);
		update('realname', req.body.realname);
		update('biography', req.body.biography);

		query += ' WHERE id = ' + req.body.id + ';';

        // Debugging
		console.log(query);

        // Just in case
		if (fieldCount === 0) {
			res.status(400).write('Invalid update data');
			res.end();
			return;
		}

		db.query(query, err => {
			if (err) {
				return next(err);
			}

			res.status(200);
			res.end();
		});
	});
});

// Necessary files
app.post('/legal', (req, res) => {
	res.sendFile(path.resolve(__dirname, './docs/legal.md'));
});

app.get('/app.bundle.js', (req, res) => {
	res.sendFile(path.resolve(__dirname, './app.bundle.js'));
});

// Fallback
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '/.index.html'));
});

// Startup
app.listen(4000, () => {
	console.log('listening to *:4000');
});
