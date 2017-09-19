import React from 'react';
import { Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class PageNotFound extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    var style = {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    };

    return (
      <div style={style}>
        <Header as='h1'>404 - Page Not Found</Header>
        <Link to='/'>Return Home</Link>
      </div>
    );
  };
}

export default PageNotFound;
