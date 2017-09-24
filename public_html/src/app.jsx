import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

//include other panels
import PageHome from './pages/page_home.jsx';
import PageLogin from './pages/page_login.jsx';
import PageMessages from './pages/page_messages.jsx';
import PageNotFound from './pages/page_not_found.jsx';
import PagePasswordChange from './pages/page_password_change.jsx';
import PagePasswordRecovery from './pages/page_password_recovery.jsx';
import PageProfile from './pages/page_profile.jsx';
import PageSignup from './pages/page_signup.jsx';

import FooterPanel from './footer_panel.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='central'>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={PageHome} />
            <Route path='/login' component={PageLogin} />
            <Route path='/messages' component={PageMessages} />
            <Route path='/passwordchange' component={PagePasswordChange} />
            <Route path='/passwordrecovery' component={PagePasswordRecovery} />
            <Route path='/profile' component={PageProfile} />
            <Route path='/signup' component={PageSignup} />
            <Route path='*' component={PageNotFound} />
          </Switch>
        </BrowserRouter>
        <FooterPanel />
      </div>
    );
  }
}

export default App;
