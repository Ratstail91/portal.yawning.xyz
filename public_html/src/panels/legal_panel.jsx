import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class LegalPanel extends React.Component {
  render() {
    var style = {
      flex: '1 1 auto',
      justifySelf: 'flex-end',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
    };

    return (
      <div style={style}>
        <Link to='/legal'>Legal Stuff</Link>
      </div>
    );
  };
}

export default withRouter(LegalPanel);
