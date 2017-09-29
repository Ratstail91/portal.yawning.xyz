import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import OptionsPanel from '../panels/options_panel.jsx';
import { storeProfile } from '../reducers/profile.js';

class PageProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      id: 0,
      email: '',
      avatar: '',
      username: '',
      realname: '',
      biography: '',
      warning: ''
    };
  };

  componentDidMount() {
    //redirect if NOT logged in (back to home)
    if (!this.props.id) {
      this.props.history.push('/');
    }

    //load the data
    this.requestProfile(
      this.props.match.params.profileId ||
      this.props.id
    );
  }

  setWarning(s) {
    this.setState({
      warning: s
    });
  }

  requestProfile(profileId) {
    //form data
    var formData = new FormData();
    formData.append('id', this.props.id);
    formData.append('token', this.props.token);
    formData.append('profileId', profileId);

    //callback
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          var json = JSON.parse(xhttp.responseText);
          this.storeProfile(
            profileId,
            json.email,
            json.avatar,
            json.username,
            json.realname,
            json.biography
          );
        }
        else if (xhttp.ststus === 400) {
          this.setWarning(xhttp.responseText);
        }
        else if (xhttp.status === 404) {
          //TODO: sub-404
          this.props.history.push('/404');
        }
      }
    }.bind(this);

    //send
    xhttp.open('POST', '/profile', true);
    xhttp.send(formData);
  }

  storeProfile(profileId, email, avatar, username, realname, biography) {
    if (profileId == this.props.id) {
      this.setState({
        id: profileId,
        email: email || '(not set)',
        avatar: avatar,
        username: username || '(not set)',
        realname: realname || '(not set)',
        biography: biography || '(not set)'
      });

      this.props.storeProfile(
        email,
        avatar,
        username,
        realname,
        biography
      );
    }
    else {
      this.setState({
        id: profileId,
        email: email || '(hidden)',
        avatar: avatar || 'private.png',
        username: username || '(hidden)',
        realname: realname || '(hidden)',
        biography: biography || '(hidden)'
      });
    }
  }

  render() {
    //styles
    var warningStyle = {
      display: this.state.warning.length > 0 ? 'flex' : 'none'
    };

    //custom options display
    var customLinks = (
      <div>
        <p><Link to='/passwordchange'>Change Password</Link></p>
        <p><Link to='#'>Edit Profile</Link></p>
        <p>Your ID: {this.props.id}</p>
        <p>Profile ID: {this.state.id}</p>
      </div>
    );

    //utilities
    var makeRow = function(left, right) {
      return (
        <tr>
          <td className='right'>{left}</td>
          <td>{right}</td>
        </tr>
      );
    }

    //standard display
    var avatar = '/avatars/' + (this.state.avatar ? this.state.avatar : 'default.png' );

    var mainPanel = (
      <div className='page'>
        <img src={avatar} className='avatarNormal' />
        <table className='flexTable'>
          <tbody>
            {makeRow('Email:', this.state.email)}
            {makeRow('Username:', this.state.username)}
            {makeRow('Real Name:', this.state.realname)}
            {makeRow('Biography:', this.state.biography)}
          </tbody>
        </table>
      </div>
    );

    return (
      <div className='page'>
        <h1 className='centered'>Profile</h1>
        <div className='warning' style={warningStyle}>
          <p>{this.state.warning}</p>
        </div>
        <div className="sexyLayout">
          <div style={{flex: '0 1 auto', display: 'flex', flexDirection: 'column'}}>
            <OptionsPanel custom={customLinks} profileClick={()=>{this.setState({editing:false}); this.requestProfile(this.props.id);}} />
            <div style={{flex: '1'}}></div>
          </div>
          {mainPanel}
        </div>
      </div>
    );
  };
}

//redux
PageProfile.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  token: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  realname: PropTypes.string.isRequired,
  biography: PropTypes.string.isRequired,
  storeProfile: PropTypes.func.isRequired
};

function mapStoreToProps(store) {
  return {
    store: store,
    id: store.profile.id,
    token: store.profile.token,
    email: store.profile.email,
    avatar: store.profile.avatar,
    username: store.profile.username,
    realname: store.profile.realname,
    biography: store.profile.biography
  };
}

function mapDispatchToProps(dispatch) {
  return {
    storeProfile: (email, avatar, username, realname, biography) => {
      dispatch(storeProfile(email, avatar, username, realname, biography));
    }
  };
}

PageProfile = connect(mapStoreToProps, mapDispatchToProps)(PageProfile);

export default withRouter(PageProfile);
