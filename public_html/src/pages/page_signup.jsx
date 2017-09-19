import React from 'react';
import { Link } from 'react-router-dom';

class PageSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    var style = {
      flex: '1'
    };

    return (
      <div style={style}>
        <h1 className='centered'>Sign Up</h1>
        <form action='/signup' method='post' className='loginForm'>
          <div>
            <label>Email:</label>
            <input type='text' name='email' />
          </div>
          <div>
            <label>Password:</label>
            <input type='password' name='password' />
          </div>
          <div>
            <label>Retype Password:</label>
            <input type='password' name='retype' />
          </div>
          <div>
            <div className='pad' />
            <div className='flexLeft'>
              <button type='submit'>Sign Up</button>
            </div>
          </div>
        </form>
        <br />
        <p>Already have an account? <Link to='/login'>Login</Link></p>
        <p>Return <Link to='/'>Home</Link></p>
      </div>
    );
  };
}

export default PageSignup;
