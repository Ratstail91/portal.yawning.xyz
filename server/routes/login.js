const bcrypt = require('bcryptjs');
const debug = require('debug')('yawning:login');
const db = require('../database');

const login = (req, res, next) => {
  // Find this email's information
  db.query('SELECT id, hash FROM profiles WHERE email = ?', [req.body.email], (err, results) => {
    if (err) {
      return next(err);
    }

    if (results.length === 0) {
      res.status(400).write('Incorrect email or password');
      res.end();
      return;
    }

    // Compare the calculated hash to the stored hash
    debug(req.body.password, results[0].hash);
    if (bcrypt.compareSync(req.body.password, results[0].hash)) {
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
};

module.exports = login;
