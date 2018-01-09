const db = require('../database');
const {getMeme} = require('../utils');

const updateProfile = (req, res, next) => {
  const query = 'SELECT lastToken FROM profiles WHERE id = ?';
  db.query(query, [req.fields.id], (err, queryResults) => {
    if (err) {
      return next(err);
    }

    // Hack check
    if (queryResults.length !== 1 || queryResults[0].lastToken !== req.fields.token) {
      console.log('Hacking attempt against profile: ' + req.fields.id);
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
    // update('email', req.fields.email);
    update('avatar', req.fields.avatar);
    update('username', req.fields.username);
    update('realname', req.fields.realname);
    update('biography', req.fields.biography);

    query += ' WHERE id = ' + req.fields.id + ';';

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
};

module.exports = updateProfile;
