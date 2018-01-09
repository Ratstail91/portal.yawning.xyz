const db = require('../database');
const {SELF, FRIEND, GROUP, BLOCKED} = require('../consts');
const {getRelationLevel} = require('../utils');

const requestProfile = (req, res, next) => {
  // Get the requester's relation level
  // (SELF, FRIEND, GROUP, PUBLIC, BLOCKED)
  getRelationLevel(db, req.fields.id, req.fields.token, req.fields.profileId, (err, relationLevel) => {
    if (err === 404 || relationLevel === BLOCKED) {
      console.log(err === 404 ? 'missing profile' : 'blocked profile', req.fields.id, req.fields.profileId);
      res.status(404);
      res.end();
      return;
    }
    if (err === 'id and token don\'t match') {
      console.log(err, req.fields.id, req.fields.token);
      // @TODO: fix this
      res.status(400).send(err + ' (Are you logged in somewhere else? Try logging out and back in.)');
      res.end();
      return;
    }
    if (err) {
      return next(err);
    }

    // Get the userId's information
    const query = 'SELECT email, avatar, username, realname, biography FROM profiles WHERE id = ?';
    db.query(query, [req.fields.profileId], (err, profileResults) => {
      if (err) {
        return next(err);
      }

      // Get the userId's visibility settings
      const query = 'SELECT visibleProfile, visibleEmail, visibleAvatar, visibleUsername, visibleRealname, visibleBiography FROM profiles WHERE id = ?';
      db.query(query, [req.fields.profileId], (err, visibilityResults) => {
        if (err) {
          return next(err);
        }

        // Determine what to add to the return message
        const pack = function (field, visible) {
          // Console.log(field, visible);
          // can see
          if (visible === 'all' || relationLevel === SELF) {
            return field;
          }
          // Friends & up
          if (visible === 'friends' && relationLevel >= FRIEND) {
            return field;
          }
          // Groups & up
          if (visible === 'groups' && relationLevel >= GROUP) {
            return field;
          }
          // No one can see
          return undefined;
        };

        // Check if profile is visible
        if (pack(true, visibilityResults[0].visibleProfile) !== true) {
          console.log('private profile');
          res.status(404);
          res.end();
          return;
        }

        const json = {
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
};

module.exports = requestProfile;
