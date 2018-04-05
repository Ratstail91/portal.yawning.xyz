import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logout } from '../reducers/profile.js';

class OptionsPanel extends React.Component {
  constructor(props) {
    super(props);

    function dummy(){};

    this.state = {
      onClick: this.props.onClick || dummy,
      homeClick: this.props.homeClick || dummy,
      profileClick: this.props.profileClick || dummy,
      partiesClick: this.props.partiesClick || dummy,
      messagesClick: this.props.messagesClick || dummy,
      friendsClick: this.props.friendsClick || dummy,
      inviteClick: this.props.inviteClick || dummy,
      logoutClick: this.props.logoutClick || dummy
    };
  };

  render() {
    //customisable sub-menu
    var custom;

    if (typeof(this.props.custom) !== "undefined") {
      custom = (
        <div>
          <hr />
          {this.props.custom}
        </div>
      );
    }

    return (
      <div className='optionsPanel'>

        <p><Link to='/' onClick={()=>{this.state.onClick();this.state.homeClick();}}>Home</Link></p>

        <p><Link to='/profile' onClick={()=>{this.state.onClick();this.state.profileClick();}}>Profile</Link></p>

        <p><Link to='/parties' onClick={()=>{this.state.onClick();this.state.partiesClick();}}>Parties</Link></p>

        <p><Link to='/messages' onClick={()=>{this.state.onClick();this.state.messagesClick();}}>Messages</Link></p>

        <p><Link to='/friends' onClick={()=>{this.state.onClick();this.state.friendsClick();}}>Friends</Link></p>

        <p><Link to='/invite' onClick={()=>{this.state.onClick();this.state.inviteClick();}}>Invite</Link></p>

        <p><Link to='/' onClick={()=>{this.state.onClick();this.state.logoutClick();this.props.logout();}}>Logout</Link></p>

        {custom}
      </div>
    );
  };
}

//redux
OptionsPanel.propTypes = {
  store: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  custom: PropTypes.node,
  onClick: PropTypes.func,
  homeClick: PropTypes.func,
  profileClick: PropTypes.func,
  partiesClick: PropTypes.func,
  messagesClick: PropTypes.func,
  friendsClick: PropTypes.func,
  inviteClick: PropTypes.func,
  logoutClick: PropTypes.func
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
