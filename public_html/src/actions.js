//list of actions
export const CLEAR_STORE = 'CLEAR_STORE';
export const REDIRECT = 'REDIRECT';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const STORE_PROFILE = 'STORE_PROFILE';

//action creators
export function clearStore() {
  return {
    type: CLEAR_STORE
  };
}

export function redirect(url, history) {
  return {
    type: REDIRECT,
    url: url,
    history: history
  };
}

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

export function storeProfile(username, firstname, lastname, biography) {
  return {
    type: STORE_PROFILE,
    username: username,
    firstname: firstname,
    lastname: lastname,
    biography: biography
  };
}
