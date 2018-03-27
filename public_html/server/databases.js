//includes
var fs = require('fs');
var mysql = require('mysql');

//TODO: move to a separate file
//(SELF, FRIEND, GROUP, PUBLIC, BLOCKED)
const SELF = 4;
const FRIEND = 3;
const GROUP = 2;
const PUBLIC = 1;
const BLOCKED = 0;

//utility function
function getRelationLevel(db, id, token, profileId, cb) {
  //TODO: expand this
  db.query('SELECT lastToken FROM profiles WHERE id = ?;', [id], function(err, results) {
    if (err) return cb(err);
    if (results[0].lastToken != token) return cb('id and token don\'t match');

    db.query('SELECT id FROM profiles WHERE id = ?;', [profileId], function(err, results) {
      if (err) return cb(err);
      if (results.length === 0) return cb(404);
      if (id == profileId) return cb(undefined, SELF);
      return cb(undefined, PUBLIC); //TODO: incomplete
    });
  });
}

//create db connection
var db;

var dbConfig = {
  host: 'island.krgamestudios.com',
  user: 'node',
  password: fs.readFileSync('../node.pwd', 'utf8').replace(/^\s+|\s+$/g, ''),
  database: 'yawning',
  port: '3306'
};

function handleDisconnect() {
  //single-use
  db = mysql.createConnection(dbConfig);

  db.connect(function(err) {
    if (err)  {
      console.log('Error when connecting to mariadb:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      db.query('use yawning;', function(err) {
        if (err) throw err;
      });
      console.log('connected to mariadb');
    }
  });

  db.on('error', function(err) {
    console.log('db error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });

  return db;
}

module.exports = {
  SELF: SELF,
  FRIEND: FRIEND,
  GROUP: GROUP,
  PUBLIC: PUBLIC,
  BLOCKED: BLOCKED,
  getRelationLevel: getRelationLevel,
  createDatabaseConnection: handleDisconnect
}
