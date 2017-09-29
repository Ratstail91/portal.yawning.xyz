import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class LegalPanel extends React.Component {
  render() {
    var style = {
      flex: '0 1 auto',
      justifySelf: 'flex-end',
      marginBottom: '-2em',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
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
