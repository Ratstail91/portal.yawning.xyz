//list of actions
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const STORE_PROFILE = 'STORE_PROFILE';
export const CLEAR_PROFILE = 'CLEAR_PROFILE';

//action creators
export function login(email, token) {
  return {
    type: LOGIN,
    email: email,
    token: token
  };
}

export function logout() {
  return {
    type: LOGOUT
  };
}

export function storeProfile(email, avatar, username, realname, biography) {
  return {
    type: STORE_PROFILE,
    email: email,
    avatar: avatar,
    username: username,
    realname: realname,
    biography: biography
  };
}

export function clearProfile() {
  return {
    type: CLEAR_PROFILE
  };
}

//initial store
var initialProfile = {
  token: 0,
  email: '',
  avatar: '',
  username: '',
  realname: '',
  biography: ''
}

//reducer
export function profileReducer(store = initialProfile, action) {
  //determine action
  switch(action.type) {
    case LOGIN:
      var newStore = JSON.parse(JSON.stringify(initialProfile));
      newStore.token = action.token;
      newStore.email = action.email;
      return newStore;

    case LOGOUT:
      return initialProfile;

    case STORE_PROFILE:
      store.email = action.email;
      store.avatar = action.avatar;
      store.username = action.username;
      store.realname = action.realname;
      store.biography = action.biography;
      return newStore;

    case CLEAR_PROFILE:
      return initialProfile;

    default:
      return store;
  }
}
