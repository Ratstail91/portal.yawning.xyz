import { CLEAR_STORE, LOGIN, LOGOUT, STORE_PROFILE } from './actions.js';

function createStore() {
  return {
    token: 0,
    profile: {
      email: '',
      username: '',
      firstname: '',
      lastname: '',
      biography: ''
    },
    posts: {
    }
  }
}

//the reducer MUST remain pure
export default function reducer(store, action) {
  //initialization
  if (typeof(store) === 'undefined') {
    return createStore();
  }

  //copy
  var newStore = JSON.parse(JSON.stringify(store));

  switch(action.type) {
    case CLEAR_STORE:
      return createStore();

    case LOGIN:
      //ensure the state is fresh
      newStore = createStore();
      newStore.token = action.token;
      newStore.profile.email = action.email;
      return newStore;

    case LOGOUT:
      //ensure the state is fresh
      newStore = createStore();
      return newStore;

    case STORE_PROFILE:
      newStore.profile.username = action.username;
      newStore.profile.firstname = action.firstname;
      newStore.profile.lastname = action.lastname;
      newStore.profile.biography = action.biography;
      return newStore;

    default:
      return store;
  }
}
