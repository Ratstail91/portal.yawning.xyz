const bcrypt = require('bcrypt');
const db = require('../database');
const {validateEmail} = require('../utils');

const login = (req, res, next) => {
  // Valid email and password
  if (!validateEmail(req.fields.email) || req.fields.password.length < 8) {
    res.status(400).write('server-side login rejection');
    res.end();
    return;
  }

  // Find this email's information
  db.query('SELECT id, salt, hash FROM profiles WHERE email = ?', [req.fields.email], (err, results) => {
    if (err) {
      return next(err);
    }

    if (results.length === 0) {
      res.status(400).write('Incorrect email or password');
      res.end();
      return;
    }

    // Gen a new hash hash
    bcrypt.hash(req.fields.password, results[0].salt, (err, hash) => {
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

      db.query(query, [rand, req.fields.email], err => {
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
};

module.exports = login;
