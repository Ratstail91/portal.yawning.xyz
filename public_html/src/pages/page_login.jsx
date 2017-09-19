import React from 'react';
import { Link } from 'react-router-dom';

class PageLogin extends React.Component {
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
        <h1 className='centered'>Login</h1>
        <form action='/login' method='post' className='loginForm'>
          <div>
            <label>Email:</label>
            <input type='text' name='email' />
          </div>
          <div>
            <label>Password:</label>
            <input type='password' name='password' />
          </div>
          <div>
            <div className='pad' />
            <div className='flexLeft'>
              <button type='submit'>Login</button>
            </div>
          </div>
        </form>
        <br />
        <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
        <p>Return <Link to='/'>Home</Link></p>
      </div>
    );
  };
}

export default PageLogin;
