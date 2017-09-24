import { combineReducers } from 'redux';
import { profileReducer } from './profile.js';

export default combineReducers({
  profile: profileReducer
});
