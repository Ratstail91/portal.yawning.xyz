import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createSession } from 'redux-session';

import App from './app.jsx';
import reducer from './reducers.js';

const session = createSession({
  ns: 'portalyawning'
});

var store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    applyMiddleware(session)
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
);
