const getRelationLevel = (db, id, token, profileId, cb) => {
  // @TODO: expand this
  db.query('SELECT lastToken FROM profiles WHERE id = ?', [id], function(err, results) {
    if (err) return cb(err);
    if (results[0].lastToken != token) return cb('id and token don\'t match');

    db.query('SELECT id FROM profiles WHERE id = ?', [profileId], function(err, results) {
      if (err) return cb(err);
      if (results.length === 0) return cb(404);
      if (id == profileId) return cb(undefined, SELF);
      return cb(undefined, PUBLIC);
    });
  });
};

module.exports = getRelationLevel;