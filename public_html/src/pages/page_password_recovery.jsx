import React from 'react';
import { Link } from 'react-router-dom';

class PagePasswordRecovery extends React.Component {
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
        <h1 className='centered'>Reset Password</h1>
        <form action='/passwordrecovery' method='post' className='loginForm'>
          <div>
            <label>Email:</label>
            <input type='text' name='email' />
          </div>
          <div>
            <div className='pad' />
            <button type='submit'>Submit</button>
          </div>
        </form>
        <br />
        <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
        <p>Return <Link to='/'>Home</Link></p>
      </div>
    );
  };
}

export default PagePasswordRecovery;
