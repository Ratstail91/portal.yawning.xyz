import React from 'react';
import { withRouter, Link } from 'react-router-dom';

class PageNotFound extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    var style = {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    };

    return (
      <div style={style}>
        <h1>404 - Page Not Found</h1>
        <Link to='/'>Return Home</Link>
      </div>
    );
  };
}

export default withRouter(PageNotFound);
