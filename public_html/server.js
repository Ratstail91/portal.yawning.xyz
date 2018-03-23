//includes
var express = require('express');
var app = express();
var http = require('http').Server(app);

//static directories
app.use('/avatars', express.static(__dirname + '/avatars'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/styles', express.static(__dirname + '/styles'));

//handle databases
var {createDatabaseConnection} = require('./server/databases.js');
db = createDatabaseConnection();

//handle accounts
var accounts = require('./server/accounts.js');
app.post('/signup', accounts.signup(db));
app.get('/verify', accounts.verify(db));
app.post('/login', accounts.login(db));
app.post('/passwordrecovery', accounts.passwordRecovery(db));

//handle profiles
var profiles = require('./server/profiles.js');
app.post('/requestprofile', profiles.requestProfile(db));
app.post('/updateprofile', profiles.updateProfile(db));

//necessary files
app.post('/legal', function(req, res) {
  res.sendFile(__dirname + '/docs/legal.md');
});

app.get('/app.bundle.js', function(req, res) {
  res.sendFile(__dirname + '/app.bundle.js');
});

//fallback
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

//startup
http.listen(4000, function() {
  console.log('listening to *:4000');
});
