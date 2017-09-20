//seriously, this should be a feature of every page
var memes = {
  'hackerman': 'http://i0.kym-cdn.com/photos/images/original/000/976/339/ded.png',
  '404': 'http://i0.kym-cdn.com/photos/images/original/000/483/553/f73.png'
};

function getMeme(id) {
  if (id) {
    return memes[id];
  }
  var keys = Object.keys(memes);
  return memes[keys[Math.floor(Math.random()*keys.length)]];
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

module.exports = {
  getMeme,
  validateEmail
};
