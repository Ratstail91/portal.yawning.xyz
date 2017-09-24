import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { login } from '../reducers/profile.js';
import { validateEmail } from '../../scripts/utilities.js';

class PageLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      warning: ''
    };
  };

  componentDidMount() {
    //redirect if logged in (back to home)
    if (this.props.token) {
      this.props.history.push('/');
    }
  }

  //client-side validation
  setWarning(s) {
    this.setState({
      warning: s
    });
  }

  myClick(e) {
    e.preventDefault();

    if (!validateEmail(this.state.email)) {
      this.setWarning('Invalid Email');
    }

    else if (this.state.password.length < 8) {
      this.setWarning('Minimum Password Length Is 8 Characters');
    }

    else {
      var formData = new FormData();
      formData.append('email', this.state.email);
      formData.append('password', this.state.password);

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
          if (xhttp.status === 200) {
            var json = JSON.parse(xhttp.responseText);

            //login and switch to the root page
            this.props.login(json.email, json.token);
            this.props.history.push('/');
          }
          else if (xhttp.status === 400) {
            this.setWarning(xhttp.responseText);
          }
        }
      }.bind(this);

      xhttp.open('POST', '/login', true);
      xhttp.send(formData);
    }
  }

  clearInput() {
    this.setState({
      email: '',
      password: '',
      warning: ''
    });
  }

  //updaters
  updateEmail(evt) {
    this.setState({
      email: evt.target.value
    });
  }

  updatePassword(evt) {
    this.setState({
      password: evt.target.value
    });
  }

  //render
  render() {
    var warningStyle = {
      display: this.state.warning.length > 0 ? 'flex' : 'none'
    };

    return (
      <div className='page'>
        <h1 className='centered'>Login</h1>
        <div className='warning' style={warningStyle}>
          <p>{this.state.warning}</p>
        </div>
        <form action='/login' method='post' className='loginForm' onSubmit={(e)=>{this.myClick(e);}}>
          <div>
            <label>Email:</label>
            <input type='text' name='email' value={this.state.email} onChange={this.updateEmail.bind(this)} />
          </div>
          <div>
            <label>Password:</label>
            <input type='password' name='password' value={this.state.password} onChange={this.updatePassword.bind(this)} />
          </div>
          <div>
            <div className='pad' />
            <button type='submit'>Login</button>
          </div>
        </form>
        <br />
        <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
        <p>Return <Link to='/'>Home</Link></p>
      </div>
    );
  };
}

//redux
PageLogin.contextTypes = {
  store: React.PropTypes.object,
  token: React.PropTypes.number
};

function mapStoreToProps(store) {
  return {
    store: store,
    token: store.profile.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (email, token) => { dispatch(login(email, token)); }
  };
}

PageLogin = connect(mapStoreToProps, mapDispatchToProps)(PageLogin);

export default withRouter(PageLogin);
