//list of actions
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const STORE_PROFILE = 'STORE_PROFILE';
export const CLEAR_PROFILE = 'CLEAR_PROFILE';

//action creators
export function login(id, token) {
  return {
    type: LOGIN,
    id: id,
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
  id: 0,
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
      newStore.id = action.id;
      newStore.token = action.token;
      return newStore;

    case LOGOUT:
      return initialProfile;

    case STORE_PROFILE:
      store.email = action.email || store.email;
      store.avatar = action.avatar || store.avatar;
      store.username = action.username || store.username;
      store.realname = action.realname || store.realname;
      store.biography = action.biography || store.biography;
      return store;

    case CLEAR_PROFILE:
      return initialProfile;

    default:
      return store;
  }
}
