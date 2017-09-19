import React from 'react';

class PageLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    var style = {
      flex: '1'
    };

    return (
      <p style={style}>Login</p>
    );
  };
}

export default PageLogin;
