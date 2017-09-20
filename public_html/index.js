var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var formidable = require('formidable');
var sendmail = require('sendmail')();

//db connections
var db = mysql.createConnection({
  host: 'localhost',
  user: 'node',
  password: fs.readFileSync('../node.pwd', 'utf8').replace(/^\s+|\s+$/g, '')
});

db.connect(function(err) {
  if (err) throw err;
  db.query('use yawning;', function(err) {
    if (err) throw err;
  });
  console.log('connected to mysql');
});

//static directories
app.use('/styles', express.static(__dirname + '/styles'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

//necessary files
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/app.bundle.js', function(req, res) {
  res.sendFile(__dirname + '/app.bundle.js');
});

//handle messages
app.post('/signup', function(req, res) {
  //formidable handles forms
  var form = formidable.IncomingForm();

  //parse form
  form.parse(req, function(err, fields) {
    if (err) throw err;

    //check if the email already exists
    db.query('SELECT COUNT(*) FROM profiles WHERE email="' + fields.email + '";', function(err, results) {
      if (err) throw err;

      if (results[0][Object.keys(results[0])[0]] !== 0) {
        res.write('<html><body><p>Email Already Exists</p></body></html>');
        res.end();
        return;
      }

      //gen salt, hash
      bcrypt.genSalt(11, function(err, salt) {
        if (err) throw err;
        bcrypt.hash(fields.password, salt, function(err, hash) {
          if (err) throw err;

          //store the email, salt & hash
          var rand = Math.floor(Math.random() * 65535);
          var query = 'REPLACE INTO signups (email, salt, hash, verify) VALUES (';
          query += '"' + fields.email + '"' + ',';
          query += '"' + salt + '"' + ',';
          query += '"' + hash + '"' + ',';
          query += rand + ');';
  console.log(query);
          db.query(query, function(err) {
            if (err) throw err;

            //send the verification email
            var addr = 'https://portal.yawning.xyz/verify?email=' + fields.email + '&verify=' + rand;
            var msg = 'Hello! Please visit the following address to verify your email: ';

            var msgHtml = '<html><body><p>' + msg + '<a href="' + addr + '">' + addr + '</a></p></body></html>';

            sendmail({
              from: 'signup@portal.yawning.com',
              to: fields.email,
              subject: 'email verification',
              text: msg + addr,
              html: msgHtml
            }, function(err, reply) {
              if (err) throw err;
              res.write('<html><body><p>Verification Email Sent</p></body></html>');
              res.end();
            });
          });
        });
      });
    });
  });
});

app.get('/verify', function(req, res) {
  var query = 'SELECT email, hash, salt, verify FROM signups WHERE email="' + req.query.email + '";';
  db.query(query, function(err, results) {
    if (err) throw err;

    if (results.length != 1) {
      res.write('<html><body><p>That username does not exist or this link has already been used.</p></body></html>');
      res.end();
      return;
    }

    if (req.query.verify != results[0].verify) {
      res.write('<html><body><p>Verification Failed!</p></body></html>');
      res.end();
      return;
    }

    //move the data from signups to profiles
    var query = 'INSERT INTO profiles (email, hash, salt) VALUES ("' + results[0].email + '","' + results[0].hash + '","' + results[0].salt + '");';
    db.query(query, function(err) {
      if (err) throw err;

      var query = 'DELETE FROM signups WHERE email="' + results[0].email + '";';
      db.query(query, function(err) {
        if (err) throw err;

        res.write('<html><body><p>Verification Succeeded!</p></body></html>');
        res.end();
      });
    });
  });
});

app.post('/login', function(req, res) {
  res.write('<p>Coming Soon</p>');
  res.end();
});

app.post('/passwordrecovery', function(req, res) {
  res.write('<p>Coming Soon</p>');
  res.end();
});

//fallback
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

//startup
http.listen(4000, function() {
  console.log('listening to *:4000');
});
