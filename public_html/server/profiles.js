var formidable = require('formidable');

var {getRelationLevel, SELF, FRIEND, GROUP, PUBLIC, BLOCKED} = require('./databases.js');

function requestProfile(db) {
  return function(req, res) {
    //formidable handles forms
    var form = formidable.IncomingForm();

    //parse form
    form.parse(req, function(err, fields) {
      if (err) throw err;

      //get the requester's relation level
      //(SELF, FRIEND, GROUP, PUBLIC, BLOCKED)
      getRelationLevel(db, fields.id, fields.token, fields.profileId, function(err, relationLevel) {
        if (err === 404 || relationLevel === BLOCKED) {
          console.log(err === 404 ? 'missing profile' : 'blocked profile', fields.id, fields.profileId);
          res.status(404);
          res.end();
          return;
        }
        else if (err === 'id and token don\'t match') {
          console.log(err, fields.id, fields.token);
          res.status(400).send(err + ' (Are you logged in somewhere else? Try logging out and back in.)'); //TODO: fix this
          res.end();
          return;
        }
        else if (err) throw err;

        //get the userId's information
        var query = 'SELECT email, avatar, username, realname, biography FROM profiles WHERE id=' + fields.profileId + ';';
        db.query(query, function(err, profileResults) {
          if (err) throw err;

          //get the userId's visibility settings
          var query = 'SELECT visibleProfile, visibleEmail, visibleAvatar, visibleUsername, visibleRealname, visibleBiography FROM profiles WHERE id=' + fields.profileId + ';';
          db.query(query, function(err, visibilityResults) {
            if (err) throw err;

            //determine what to add to the return message
            var pack = function(field, visible) {
//console.log(field, visible);
              //can see
              if (visible == 'all' || relationLevel == SELF) return field;
              //friends & up
              if (visible == 'friends' && relationLevel >= FRIEND) return field;
              //groups & up
              if (visible == 'groups' && relationLevel >= GROUP) return field;
              //no one can see
              return undefined;
            };

            //check if profile is visible
            if (pack(true, visibilityResults[0].visibleProfile) !== true) {
              console.log('private profile');
              res.status(404);
              res.end();
              return;
            }

            var json = {
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
    });
  };
}

function updateProfile(db) {
  return function(req, res) {
    //formidable handles forms
    var form = formidable.IncomingForm();

    //parse form
    form.parse(req, function(err, fields) {
      if (err) throw err;

      var query = 'SELECT lastToken FROM profiles WHERE id = ?;';
      db.query(query, [fields.id], function(err, queryResults) {
        if (err) throw err;

        //hack check
        if (queryResults.length !== 1 || queryResults[0].lastToken != fields.token) {
          console.log('Hacking attempt against profile: ' + fields.id);
          res.status(400).write('<img src="' + getMeme('hackerman') + '" />');
          res.end();
          return;
        }

        //create the update system
        var fieldCount = 0;
        var query = 'UPDATE profiles SET ';
        var update = function(name, value) {
          if (value != undefined) {
            if (fieldCount > 0) {
              query += ', ';
            }
            query += name + ' = \'' + value + '\' ';
            fieldCount += 1;
          }
        }

        //add to the query
//        update('email', fields.email);
        update('avatar', fields.avatar);
        update('username', fields.username);
        update('realname', fields.realname);
        update('biography', fields.biography);

        query += ' WHERE id = ' + fields.id + ';';

        //debugging
        console.log(query);

        //just in case
        if (fieldCount === 0) {
          res.status(400).write('Invalid update data');
          res.end();
          return;
        }

        db.query(query, function(err, updateResults) {
          if (err) throw err;

          res.status(200);
          res.end();
        });
      });
    });
  };
}

module.exports = {
  requestProfile: requestProfile,
  updateProfile: updateProfile
}