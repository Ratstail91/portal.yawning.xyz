const sendmail = require('sendmail')();
const bcrypt = require('bcryptjs');
const debug = require('debug')('yawning:signup');
const db = require('../database');
const {getMeme, validateEmail} = require('../utils');

const signup = (req, res, next) => {
  // Valid email and password
  if (!validateEmail(req.body.email) || req.body.password.length < 8 || req.body.password !== req.body.retype) {
    debug('Invalid email and/or password');
    res.write('<html><body><img src="' + getMeme('hackerman') + '" /></body></html>');
    res.end();
    return;
  }
  // Check if the email already exists
  db.query('SELECT COUNT(*) FROM profiles WHERE email = ?', [req.body.email], (err, results) => {
    if (err) {
      debug(err);
      return next(err);
    }

    if (results[0][Object.keys(results[0])[0]] !== 0) {
      debug('Email already exists.');
      res.write('<html><body><p>Email Already Exists</p></body></html>');
      res.end();
      return;
    }

    // Gen salt & hash
    const salt = bcrypt.genSaltSync(11);
    const hash = bcrypt.hashSync(req.body.password, salt);

    // Store the email & hash
    const rand = Math.floor(Math.random() * 65535);
    const query = 'REPLACE INTO signups (email, hash, verify) VALUES (?, ?, ?)';

    db.query(query, [req.body.email, hash, rand], err => {
      if (err) {
        debug(err);
        return next(err);
      }

      // Send the verification email
      const addr = 'https://portal.yawning.xyz/verify?email=' + req.body.email + '&verify=' + rand;
      const msg = 'Hello! Please visit the following address to verify your email: ';
      const msgHtml = '<html><body><p>' + msg + '<a href="' + addr + '">' + addr + '</a></p></body></html>';

      // If we're in development env we should skip the email
      if (process.env.NODE_ENV === 'development') {
        debug(`Skipping Email verification as we're in development mode.`);
        res.write(`<html><body><p>Skipping Email as we're in development mode.</p></body></html>`);
        res.end();
        return;
      }

      debug(`Sending Email verification.`);
      sendmail({
        from: 'signup@portal.yawning.com',
        to: req.body.email,
        subject: 'email verification',
        text: msg + addr,
        html: msgHtml
      }, err => {
        if (err) {
          debug(err);
          res.write('<html><body><p>An Unknown Error Occured (did you use a valid email?).</p><p>' + err + '</p></body></html>');
          res.end();
          return;
        }
        debug('Verification email sent');
        res.write('<html><body><p>Verification Email Sent</p></body></html>');
        res.end();
      });
    });
  });
};

module.exports = signup;
