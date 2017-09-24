import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { validateEmail } from '../../scripts/utilities.js';

class PageSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      retype: '',
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
    if (!validateEmail(this.state.email)) {
      e.preventDefault();
      this.setWarning('Invalid Email');
    }

    else if (this.state.password.length < 8) {
      e.preventDefault();
      this.setWarning('Minimum Password Length Is 8 Characters');
    }

    else if (this.state.password !== this.state.retype) {
      e.preventDefault();
      this.setWarning('Passwords Do Not Match');
    }
  }

  clearInput() {
    this.setState({
      email: '',
      password: '',
      retype: '',
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

  updateRetype(evt) {
    this.setState({
      retype: evt.target.value
    });
  }

  //render
  render() {
    var style = {
      flex: '1'
    };

    var warningStyle = {
      display: this.state.warning.length > 0 ? 'flex' : 'none'
    };

    return (
      <div style={style}>
        <h1 className='centered'>Sign Up</h1>
        <div className='warning' style={warningStyle}>
          <p>{this.state.warning}</p>
        </div>
        <form action='/signup' method='post' className='loginForm' onSubmit={(e)=>{this.myClick(e);}}>
          <div>
            <label>Email:</label>
            <input type='text' name='email' value={this.state.email} onChange={this.updateEmail.bind(this)} />
          </div>
          <div>
            <label>Password:</label>
            <input type='password' name='password' value={this.state.password} onChange={this.updatePassword.bind(this)} />
          </div>
          <div>
            <label>Retype Password:</label>
            <input type='password' name='retype' value={this.state.retype} onChange={this.updateRetype.bind(this)} />
          </div>
          <div>
            <div className='pad' />
            <button type='submit'>Sign Up</button>
          </div>
        </form>
        <br />
        <p>Already have an account? <Link to='/login'>Login</Link></p>
        <p>Return <Link to='/'>Home</Link></p>
      </div>
    );
  };
}

//redux
PageSignup.contextTypes = {
  store: React.PropTypes.object,
  token: React.PropTypes.number
};

function mapStoreToProps(store) {
  return {
    store: store,
    token: store.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    //
  };
}

PageSignup = connect(mapStoreToProps, mapDispatchToProps)(PageSignup);

export default withRouter(PageSignup);
