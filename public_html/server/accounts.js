//includes
var bcrypt = require('bcrypt');
var formidable = require('formidable');
var sendmail = require('sendmail')();

var { getMeme, validateEmail } = require('../scripts/utilities.js');

//closures
function signup(db) {
  return function(req, res) {
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
      var query = 'SELECT COUNT(*) FROM profiles WHERE email= ?;';
      db.query(query, [fields.email], function(err, results) {
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

            var query = 'REPLACE INTO signups (email, salt, hash, verify) VALUES (?, ?, ?, ?);';
            db.query(query, [fields.email, salt, hash, rand], function(err) {
              if (err) throw err;

              //send the verification email
              var addr = 'https://portal.yawning.xyz/verify?email=' + fields.email + '&verify=' + rand;
              var msg = 'Hello! Please visit the following address to verify your email: ';

              var msgHtml = '<html><body><p>' + msg + '<a href="' + addr + '">' + addr + '</a></p></body></html>';

              sendmail({
                from: 'signup@portal.yawning.com',
                to: fields.email,
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
  };
}

//accessable via email
function verify(db) {
  return function(req, res) {
    var query = 'SELECT email, hash, salt, verify FROM signups WHERE email="' + req.query.email + '";';
    db.query(query, function(err, results) {
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

      // move the data from signups to profiles
      var query = 'INSERT INTO profiles (email, hash, salt) VALUES (?, ?, ?);';
      db.query(query, [results[0].email, results[0].hash, results[0].salt], function(err) {
        if (err) throw err;

        db.query('DELETE FROM signups WHERE email = ?;', [results[0].email], function(err) {
          if (err) throw err;

          res.write('<html><body><p>Verification Succeeded!</p></body></html>');
          res.end();
        });
      });
    });
  };
}

function login(db) {
  return function(req, res) {
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
      db.query('SELECT id, salt, hash FROM profiles WHERE email = ?;', [fields.email], function(err, results) {
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
          var query = 'UPDATE profiles SET lastToken = ? WHERE email = ?;';

          db.query(query, [rand, fields.email], function(err) {
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
  };
}

function passwordRecovery(db) {
  return function(req, res) {
    res.write('<p>Coming Soon</p>');
    res.end();
  };
}

module.exports = {
  signup: signup,
  verify: verify,
  login: login,
  passwordRecovery: passwordRecovery
};
