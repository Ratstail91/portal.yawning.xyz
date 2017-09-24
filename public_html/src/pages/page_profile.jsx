import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { logout } from '../reducers/profile.js';

class PageProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  componentDidMount() {
    //redirect if NOT logged in (back to home)
    if (!this.props.token) {
      this.props.history.push('/');
    }
  }

  render() {
    var style = {
      flex: '1'
    };

    return (
      <div style={style}>
        <p>profile</p>
        <Link to="/" onClick={this.props.logout}>Logout</Link>
      </div>
    );
  };
}

//redux
PageProfile.contextTypes = {
  store: React.PropTypes.object,
  token: React.PropTypes.number
};

function mapStoreToProps(store) {
  return {
    store: store,
    token: store.profile.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => { dispatch(logout()); }
  };
}

PageProfile = connect(mapStoreToProps, mapDispatchToProps)(PageProfile);

export default withRouter(PageProfile);
