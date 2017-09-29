//include basic libaries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { MemoryRouter, Switch, Route } from 'react-router-dom';

//include basic needs
import App from '../src/app.jsx';
import reducer from '../src/reducers/reducers.js';
import DevTools from '../src/dev_tools.jsx';

//include all pages
import PageHome from '../src/pages/page_home.jsx';
import PageLegal from '../src/pages/page_legal.jsx';
import PageLogin from '../src/pages/page_login.jsx';
import PageNotFound from '../src/pages/page_not_found.jsx';
import PagePasswordRecovery from '../src/pages/page_password_recovery.jsx';
import PageProfile from '../src/pages/page_profile.jsx';
import PageSignup from '../src/pages/page_signup.jsx';

//MemoryRouter implementation of App for testing
console.log('Ensure MemoryApp and App are the same');
class MemoryApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='central'>
        <MemoryRouter initialEntries={['/']} initialIndex={1}>
          <Switch>
            <Route exact path='/' component={PageHome} />
            <Route path='/legal' component={PageLegal} />
            <Route path='/login' component={PageLogin} />
            <Route path='/passwordrecovery' component={PagePasswordRecovery} />
            <Route path='/profile/:profileId?' component={PageProfile} />
            <Route path='/signup' component={PageSignup} />
            <Route path='*' component={PageNotFound} />
          </Switch>
        </MemoryRouter>
      </div>
    );
  }
}

//utilities
function initRoot() {
  //create the root node, then append it to the body
  var rootNode = document.createElement("DIV");
  rootNode.id = "root";
  document.querySelector('body').appendChild(rootNode);
  return rootNode;
};

function cleanupRoot(rootNode) {
  rootNode = rootNode || document.querySelector('#root');
  //cleanup
  document.querySelector('body').removeChild(rootNode);
}

function makeStore() {
  return createStore(
    reducer,
    compose(
      applyMiddleware(thunk),
      DevTools.instrument()
    )
  );
}

//tests
describe('intergration', function() {
  //individual tests
  it('imports', function() {
    expect(App).toBeDefined();
    expect(reducer).toBeDefined();
    expect(DevTools).toBeDefined();
    expect(PageHome).toBeDefined();
    expect(PageLogin).toBeDefined();
    expect(PageNotFound).toBeDefined();
    expect(PagePasswordRecovery).toBeDefined();
    expect(PageProfile).toBeDefined();
    expect(PageSignup).toBeDefined();
  });

  it('render App + DevTools', function() {
    var rootNode = initRoot();

    //render (will render 404)
    ReactDOM.render(
      <Provider store={makeStore()}>
        <div>
          <App />
          <DevTools />
        </div>
      </Provider>,
      rootNode
    );

    //test
    expect(rootNode.innerHTML).toBeDefined();

    cleanupRoot(rootNode);
  });

  it('render MemoryApp', function() {
    var rootNode = initRoot();

    ReactDOM.render(
      <Provider store={makeStore()}>
        <MemoryApp />
      </Provider>,
      rootNode
    );

    //test
    expect(rootNode.innerHTML).toBeDefined();

    cleanupRoot(rootNode);
  });
});
