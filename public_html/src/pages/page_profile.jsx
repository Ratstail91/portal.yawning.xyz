import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

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
      <p style={style}>profile</p>
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
    token: store.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    //
  };
}

//this line breaks everything
PageProfile = connect(mapStoreToProps, mapDispatchToProps)(PageProfile);

export default withRouter(PageProfile);
