import React from 'react';

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

export default PageProfile;
