//TODO: move to a separate file
//(SELF, FRIEND, GROUP, PUBLIC, BLOCKED)
const SELF = 4;
const FRIEND = 3;
const GROUP = 2;
const PUBLIC = 1;
const BLOCKED = 0;

//utility function
function getRelationLevel(db, id, token, profileId, cb) {
  //TODO: expand this
  db.query('SELECT lastToken FROM profiles WHERE id=?', [id], function(err, results) {
    if (err) return cb(err);
    if (results[0].lastToken != token) return cb('id and token don\'t match');

    db.query('SELECT id FROM profiles WHERE id=?', [profileId] function(err, results) {
      if (err) return cb(err);
      if (results.length === 0) return cb(404);
      if (id == profileId) return cb(undefined, SELF);
      return cb(undefined, PUBLIC);
    });
  });
}

//includes
var express = require('express');
var app = express();
var http = require('http').Server(app);

var bcrypt = require('bcrypt');
var formidable = require('formidable');
var fs = require('fs');
var mysql = require('mysql');
var sendmail = require('sendmail')();

var { getMeme, validateEmail } = require('./scripts/utilities.js');

//db connections
var db = mysql.createConnection({
  host: 'localhost',
  user: 'node',
  password: fs.readFileSync('../node.pwd', 'utf8').replace(/^\s+|\s+$/g, '')
});

db.connect(function(err) {
  if (err) throw err;
  db.query('use yawning;', function(err) {
    if (err) throw err;
  });
  console.log('connected to mysql');
});

//static directories
app.use('/avatars', express.static(__dirname + '/avatars'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/styles', express.static(__dirname + '/styles'));

//handle messages
app.post('/signup', function(req, res) {
  //formidable handles forms
  var form = formidable.IncomingForm();

  //parse form
  form.parse(req, function(err, fields) {
    if (err) throw err;

    //valid email and password
    if (!validateEmail(fields.email) || fields.password.length < 8 || fields.password !== fields.retype) {
      res.write('<html><body><img src="' + getMeme('hackerman') + '" /></body></html>');
      res.end();
      return;
    }

    //check if the email already exists
    db.query('SELECT COUNT(*) FROM profiles WHERE email=?', [fields.email], function(err, results) {
      if (err) throw err;

      if (results[0][Object.keys(results[0])[0]] !== 0) {
        res.write('<html><body><p>Email Already Exists</p></body></html>');
        res.end();
        return;
      }

      //gen salt, hash
      bcrypt.genSalt(11, function(err, salt) {
        if (err) throw err;
        bcrypt.hash(fields.password, salt, function(err, hash) {
          if (err) throw err;

          //store the email, salt & hash
          var rand = Math.floor(Math.random() * 65535);
          var query = 'REPLACE INTO signups (email, salt, hash, verify) VALUES (?,?,?,?)';

          db.query(query, [fields.email, salt, hash, rand], function(err) {
            if (err) throw err;

            //send the verification email
            var addr = 'https://portal.yawning.xyz/verify?email=' + fields.email + '&verify=' + rand; // possible XSS.... email=" onmouseover=alert(1), you do no server-side email validation
            var msg = 'Hello! Please visit the following address to verify your email: ';

            var msgHtml = '<html><body><p>' + msg + '<a href="' + addr + '">' + addr + '</a></p></body></html>';

            sendmail({
              from: 'signup@portal.yawning.com',
              to: fields.email, // what if the email is bob@smith.com,bob2@smith.com,bob3@smith.com,bob4@smith.com - it'll send to all emails since it's considered valid emails
              subject: 'email verification',
              text: msg + addr,
              html: msgHtml
            }, function(err, reply) {
              if (!err) {
                res.write('<html><body><p>Verification Email Sent</p></body></html>');
                res.end();
              }
              else {
                //error
                res.write('<html><body><p>An Unknown Error Occured (did you use a valid email?).</p><p>' + err + '</p></body></html>');
                res.end();
              }
            });
          });
        });
      });
    });
  });
});

//accessable via email
app.get('/verify', function(req, res) {
  var query = 'SELECT email, hash, salt, verify FROM signups WHERE email=?';
  db.query(query, [req.query.email], function(err, results) {
    if (err) throw err;

    if (results.length != 1) {
      res.write('<html><body><p>That username does not exist or this link has already been used.</p></body></html>');
      res.end();
      return;
    }

    if (req.query.verify != results[0].verify) {
      res.write('<html><body><p>Verification Failed!</p></body></html>');
      res.end();
      return;
    }

    //move the data from signups to profiles
    var query = 'INSERT INTO profiles (email, hash, salt) VALUES (?,?,?);';
    db.query(query, [results[0].email,results[0].hash,results[0].salt], function(err) {
      if (err) throw err;

      var query = 'DELETE FROM signups WHERE email=?';
      db.query(query, [results[0].email], function(err) {
        if (err) throw err;

        res.write('<html><body><p>Verification Succeeded!</p></body></html>');
        res.end();
      });
    });
  });
});

app.post('/login', function(req, res) {
  //formidable handles forms
  var form = formidable.IncomingForm();

  //parse form
  form.parse(req, function(err, fields) {
    if (err) throw err;

    //valid email and password
    if (!validateEmail(fields.email) || fields.password.length < 8) {
      res.status(400).write('<img src="' + getMeme('hackerman') + '" />');
      res.end();
      return;
    }

    //find this email's information
    db.query('SELECT id, salt, hash FROM profiles WHERE email=?', [fields.email], function(err, results) {
      if (err) throw err;

      if (results.length === 0) {
        res.status(400).write('Incorrect Email Or Password');
        res.end();
        return;
      }

      //gen a new hash hash
      bcrypt.hash(fields.password, results[0].salt, function(err, hash) {
        if (err) throw err;

        //compare the calculated hash to the stored hash
        if (hash !== results[0].hash) {
          res.status(400).write('Incorrect Email Or Password');
          res.end();
          return;
        }

        //create and store the login token
        var rand = Math.floor(Math.random() * 65535);

        //TODO: allow multiple login sources
        var query = 'UPDATE profiles SET lastToken=? WHERE email=?;';

        db.query(query, [rand,fields.email], function(err) {
          if (err) throw err;

            //send the JSON containing the email and token
            res.status(200).json({
              id: results[0].id,
              token: rand
            });
            res.end();
        });
      });
    });
  });
});

app.post('/passwordrecovery', function(req, res) {
  res.write('<p>Coming Soon</p>');
  res.end();
});

app.post('/requestprofile', function(req, res) {
  //formidable handles forms
  var form = formidable.IncomingForm();

  //parse form
  form.parse(req, function(err, fields) {
    if (err) throw err;

    //get the requester's relation level
    //(SELF, FRIEND, GROUP, PUBLIC, BLOCKED)
    getRelationLevel(db, fields.id, fields.token, fields.profileId, function(err, relationLevel) {
      if (err === 404 || relationLevel === BLOCKED) {
        console.log(err === 404 ? 'missing profile' : 'blocked profile', fields.id, fields.profileId);
        res.status(404);
        res.end();
        return;
      }
      else if (err === 'id and token don\'t match') {
        console.log(err, fields.id, fields.token);
        res.status(400).send(err + ' (Are you logged in somewhere else? Try logging out and back in.)'); //TODO: fix this
        res.end();
        return;
      }
      else if (err) throw err;

      //get the userId's information
      var query = 'SELECT email, avatar, username, realname, biography FROM profiles WHERE id=?';
      db.query(query, [fields.profileId], function(err, profileResults) {
        if (err) throw err;

        //get the userId's visibility settings
        var query = 'SELECT visibleProfile, visibleEmail, visibleAvatar, visibleUsername, visibleRealname, visibleBiography FROM profiles WHERE id=?';
        db.query(query, [fields.profileId], function(err, visibilityResults) {
          if (err) throw err;

          //determine what to add to the return message
          var pack = function(field, visible) {
//console.log(field, visible);
            //can see
            if (visible == 'all' || relationLevel == SELF) return field;
            //friends & up
            if (visible == 'friends' && relationLevel >= FRIEND) return field;
            //groups & up
            if (visible == 'groups' && relationLevel >= GROUP) return field;
            //no one can see
            return undefined;
          };

          //check if profile is visible
          if (pack(true, visibilityResults[0].visibleProfile) !== true) {
            console.log('private profile');
            res.status(404);
            res.end();
            return;
          }

          var json = {
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
});

app.post('/updateprofile', function(req, res) {
  //formidable handles forms
  var form = formidable.IncomingForm();

  //parse form
  form.parse(req, function(err, fields) {
    if (err) throw err;

    var query = 'SELECT lastToken FROM profiles WHERE id=?';
    db.query(query, [fields.id], function(err, queryResults) {
      if (err) throw err;

      //hack check
      if (queryResults.length !== 1 || queryResults[0].lastToken != fields.token) {
        console.log('Hacking attempt against profile: ' + fields.id);
        res.status(400).write('<img src="' + getMeme('hackerman') + '" />');
        res.end();
        return;
      }

      //create the update system
      var fieldsToUpdate = [];
      var fieldCount = 0;
      var query = 'UPDATE profiles SET ';
      var update = function(name, value) {
        if (value != undefined) {
          if (fieldCount > 0) {
            query += ', ';
          }
          query += name + ' = ? ';
          fieldCount += 1;
          fieldsToUpdate.push(value);
        }
      }

      //add to the query
//      update('email', fields.email);
      update('avatar', fields.avatar);
      update('username', fields.username);
      update('realname', fields.realname);
      update('biography', fields.biography);

      query += ' WHERE id = ?';
      fieldsToUpdate.push(fields.id);

      //debugging
      console.log(query);

      //just in case
      if (fieldCount === 0) {
        res.status(400).write('Invalid update data');
        res.end();
        return;
      }

      db.query(query, fieldsToUpdate, function(err, updateResults) {
        if (err) throw err;

        res.status(200);
        res.end();
      });
    });
  });
});

//necessary files
app.post('/legal', function(req, res) {
  res.sendFile(__dirname + '/docs/legal.md');
});

app.get('/app.bundle.js', function(req, res) {
  res.sendFile(__dirname + '/app.bundle.js');
});

//fallback
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

//startup
http.listen(4000, function() {
  console.log('listening to *:4000');
});
