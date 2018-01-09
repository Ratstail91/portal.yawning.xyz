const path = require('path');
const express = require('express');
const expressFormidable = require('express-formidable');
const bodyParser = require('body-parser');
const {login, requestProfile, signup, updateProfile, verify} = require('./routes');

const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// Parse application/json
app.use(bodyParser.json());

// Parse form data
app.use(expressFormidable());

// Static directories
const workingDir = path.resolve(__dirname, '../public_html');
app.use('/', express.static(workingDir));
app.use('/avatars', express.static(path.join(workingDir, './avatars')));
app.use('/styles', express.static(path.join(workingDir, './styles')));

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

// Necessary files
app.post('/legal', (req, res) => {
  return res.sendFile(workingDir + '/docs/legal.md');
});

app.get('/app.bundle.js', (req, res) => {
  return res.sendFile(workingDir + '/app.bundle.js');
});

// Fallback
app.get('*', (req, res) => {
  return res.sendFile(workingDir + '/index.html');
});

// Startup
app.listen(4000, () => {
  console.log('listening to *:4000');
});
