import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logout } from '../reducers/profile.js';

class OptionsPanel extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    var style = {
      flex: '0 1 auto',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'black',
      margin: '5px',
      padding: '0 5px'
    };

    var hrStyle = {
      border: 'none',
      height: '1px',
      color: 'black',
      backgroundColor: 'black'
    };

    //customisable sub-menu
    var custom;

    if (typeof(this.props.custom) !== "undefined") {
      custom = (
        <div>
          <hr style={hrStyle} />
          {this.props.custom}
        </div>
      );
    }

    return (
      <div style={style}>
        <p><Link to='/'>Home</Link></p>
        <p><Link to='/profile'>Profile</Link></p>
        <p><Link to='/parties'>Parties</Link></p>
        <p><Link to='/messages'>Messages</Link></p>
        <p><Link to='/friends'>Friends</Link></p>
        <p><Link to='/invite'>Invite</Link></p>
        <p><Link to='/' onClick={this.props.logout}>Logout</Link></p>
        {custom}
      </div>
    );
  };
}

//redux
OptionsPanel.propTypes = {
  store: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  custom: PropTypes.node
};

function mapStoreToProps(store) {
  return {
    store: store
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => { dispatch(logout()); }
  };
}

OptionsPanel = connect(mapStoreToProps, mapDispatchToProps)(OptionsPanel);

export default withRouter(OptionsPanel);
