var express = require('express');
var app = express();
var http = require('http').Server(app);

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

//startup
http.listen(4000, function() {
  console.log('listening to *:4000');
});
