const sendmail = require('sendmail')();
const bcrypt = require('bcrypt');
const db = require('../database');
const {getMeme, validateEmail} = require('../utils');

const signup = (req, res, next) => {
  // Valid email and password
  if (!validateEmail(req.fields.email) || req.fields.password.length < 8 || req.fields.password !== req.fields.retype) {
    res.write('<html><body><img src="' + getMeme('hackerman') + '" /></body></html>');
    res.end();
    return;
  }
  // Check if the email already exists
  db.query('SELECT COUNT(*) FROM profiles WHERE email = ?', [req.fields.email], (err, results) => {
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

      bcrypt.hash(req.fields.password, salt, (err, hash) => {
        if (err) {
          next(err);
        }

        // Store the email, salt & hash
        const rand = Math.floor(Math.random() * 65535);
        const query = 'REPLACE INTO signups (email, salt, hash, verify) VALUES (?, ?, ?, ?)';

        db.query(query, [req.fields.email, salt, hash, rand], err => {
          if (err) {
            return next(err);
          }

          // Send the verification email
          const addr = 'https://portal.yawning.xyz/verify?email=' + req.fields.email + '&verify=' + rand;
          const msg = 'Hello! Please visit the following address to verify your email: ';
          const msgHtml = '<html><body><p>' + msg + '<a href="' + addr + '">' + addr + '</a></p></body></html>';

          sendmail({
            from: 'signup@portal.yawning.com',
            to: req.fields.email,
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
};

module.exports = signup;
