import * as actions from "../actions/profile.js";

let initialStore = {
  id: 0,
  token: 0,
  email: '',
  avatar: '',
  username: '',
  realname: '',
  biography: ''
}

let reducer = (store = initialStore, action) => {
	switch(action.type) {
		case actions.LOGIN: {
			let newStore = JSON.parse(JSON.stringify(initialStore));
			newStore.id = action.id;
			newStore.token = action.token;
			return newStore;
		}

		case actions.LOGOUT:
			return initialStore;

		case actions.STORE_PROFILE: {
			let newStore = JSON.parse(JSON.stringify(initialStore));
			newStore.email = action.email || newStore.email;
			newStore.avatar = action.avatar || newStore.avatar;
			newStore.username = action.username || newStore.username;
			newStore.realname = action.realname || newStore.realname;
			newStore.biography = action.biography || newStore.biography;
			return newStore;
		}

		case actions.CLEAR_PROFILE:
			return initialStore;

		default:
			return store;
	}
}

export default reducer;