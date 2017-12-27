//Seriously, this should be a feature of every page
const memes = {
  hackerman: 'http://i0.kym-cdn.com/photos/images/original/000/976/339/ded.png',
  404: 'http://i0.kym-cdn.com/photos/images/original/000/483/553/f73.png'
};

const getMeme = function(id) {
  if (id) {
    return memes[id];
  }
  var keys = Object.keys(memes);
  return memes[keys[Math.floor(Math.random() * keys.length)]];
};

module.exports = getMeme;
