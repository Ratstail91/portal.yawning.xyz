const fallback = require('express-history-api-fallback');
const express = require('express');
const bodyParser = require('body-parser');
const {login, requestProfile, signup, updateProfile, verify} = require('./routes');

const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// Parse application/json
app.use(bodyParser.json());

// Static directories
const workingDir = `${__dirname}/../public_html/`;
app.use(express.static(workingDir));

// Handle messages
app.post('/signup', signup);

// Accessable via email
app.get('/verify', verify);

app.post('/login', login);

app.post('/passwordrecovery', (req, res) => {
  res.write('<p>Coming Soon</p>');
  res.end();
});

app.post('/requestprofile', requestProfile);

app.post('/updateprofile', updateProfile);

app.use(fallback('index.html', {
  root: workingDir
}));

// Startup
app.listen(4000, () => {
  console.log('listening to *:4000');
});
