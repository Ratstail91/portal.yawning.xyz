import React from 'react';

class PageSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    var style = {
      flex: '1'
    };

    return (
      <p style={style}>Signup</p>
    );
  };
}

export default PageSignup;
