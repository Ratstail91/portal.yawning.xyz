import React from 'react';
import { connect } from 'react-redux';

class PageProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

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
  store: React.PropTypes.object
};

function mapStoreToProps(state) {
  return {
    store: store
  };
}

function mapDispatchToProps(dispatch) {
  return {
    //
  };
}

PageProfile = connect(mapStoreToProps, mapDispatchToProps)(PageProfile);

export default PageProfile;
