const debug = require('debug')('yawning:verify');
const db = require('../database');

const verify = (req, res, next) => {
  const query = 'SELECT email, hash, verify FROM signups WHERE email = ?';
  debug('Verifying %s', req.query.email);
  db.query(query, [req.query.email], (err, results) => {
    if (err) {
      return next(err);
    }

    if (results.length !== 1) {
      res.write('<html><body><p>That username does not exist or this link has already been used.</p></body></html>');
      res.end();
      return;
    }

    if (Number(req.query.verify) !== Number(results[0].verify)) {
      res.write('<html><body><p>Verification Failed!</p></body></html>');
      res.end();
      return;
    }

    // Move the data from signups to profiles
    const query = 'INSERT INTO profiles (email, hash) VALUES (?, ?);';
    db.query(query, [results[0].email, results[0].hash], err => {
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
};

module.exports = verify;
