const debug = require('debug')('yawning:updateProfile');
const db = require('../database');
const {getMeme} = require('../utils');

const updateProfile = (req, res, next) => {
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
    debug(query);

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
};

module.exports = updateProfile;
