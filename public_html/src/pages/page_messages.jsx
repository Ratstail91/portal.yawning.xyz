import React from 'react';

class PageMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    var style = {
      flex: '1'
    };

    return (
      <p style={style}>Messages</p>
    );
  };
}

export default PageMessages;
