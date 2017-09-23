import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createSession } from 'redux-session';

import App from './app.jsx';
import reducer from './reducers.js';
import DevTools from './dev_tools.jsx';

const session = createSession({
  ns: 'portalyawning'
});

var store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    applyMiddleware(session),
    DevTools.instrument()
  )
);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <App />
      <DevTools />
    </div>
  </Provider>,
  document.querySelector('#root')
);
