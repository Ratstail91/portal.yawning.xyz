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