import React from 'react';
import { Link } from 'react-router-dom';

class PageHome extends React.Component {
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
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/login'>Login</Link></li>
          <li><Link to='/signup'>Signup</Link></li>
          <li><Link to='/passwordchange'>Change Password</Link></li>
          <li><Link to='/passwordrecovery'>Recover Lost Password</Link></li>
          <li><Link to='/profile'>Profile</Link></li>
          <li><Link to='/messages'>Messages</Link></li>
          <li><Link to='/404'>404 Test Page</Link></li>
        </ul>
      </div>
    );
  };
}

export default PageHome;
