const fs = require('fs');
const mysql = require('mysql');

// Db connections
const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.MYSQL_USERNAME || 'node',
  password: process.env.MYSQL_PASSWORD || fs.readFileSync('../node.pwd', 'utf8').replace(/^\s+|\s+$/g, '')
});

db.connect(err => {
  if (err) {
    throw err;
  }
  db.query('use yawning;', err => {
    if (err) {
      throw err;
    }
  });
  console.info('connected to mysql');
});

module.exports = db;
