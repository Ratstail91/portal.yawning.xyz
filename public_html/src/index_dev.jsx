import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import App from './app.jsx';
import reducer from './reducers/reducers.js';
import DevTools from './dev_tools.jsx';

//persistence
var ITEM_NAME = 'profile.portal.yawning';
var profile = localStorage.getItem(ITEM_NAME);
profile = profile ? JSON.parse(profile) : {};

//store
var store = createStore(
  reducer,
  { profile: profile },
  compose(
    applyMiddleware(thunk),
    DevTools.instrument()
  )
);

//persistence
store.subscribe(()=>{
  localStorage.setItem(ITEM_NAME, JSON.stringify(store.getState().profile));
});

//render
ReactDOM.render(
  <Provider store={store}>
    <div>
      <App />
      <DevTools />
    </div>
  </Provider>,
  document.querySelector('#root')
);
