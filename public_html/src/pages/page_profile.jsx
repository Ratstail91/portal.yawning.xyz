import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import OptionsPanel from '../panels/options_panel.jsx';

class PageProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      warning: ''
    };
  };

  componentDidMount() {
    //redirect if NOT logged in (back to home)
    if (!this.props.token) {
      this.props.history.push('/');
    }
  }

  setWarning(s) {
    this.setState({
      warning: s
    });
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
    var avatar = '/avatars/' + (this.props.avatar ? this.props.avatar : 'default.png' );

    var mainPanel = (
      <div className='page'>
        <img src={avatar} className='avatarNormal' />
        <table className='flexTable'>
          {makeRow('Email:', this.props.email)}
          {makeRow('Username:', this.props.username)}
          {makeRow('Real Name:', this.props.realname)}
          {makeRow('Biography:', this.props.biography)}
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
          <div>
            <OptionsPanel custom={customLinks} />
            <div style={{flex: '1'}}></div>
          </div>
          {mainPanel}
        </div>
      </div>
    );
  };
}

//redux
PageProfile.contextTypes = {
  store: React.PropTypes.object,
  token: React.PropTypes.number,
  email: React.PropTypes.string,
  avatar: React.PropTypes.string,
  username: React.PropTypes.string,
  realname: React.PropTypes.string,
  biography: React.PropTypes.string
};

function mapStoreToProps(store) {
  return {
    store: store,
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
    //
  };
}

PageProfile = connect(mapStoreToProps, mapDispatchToProps)(PageProfile);

export default withRouter(PageProfile);
