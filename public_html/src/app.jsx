import React from 'react';

//include other panels
import FooterPanel from './footer_panel.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var style = {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    };

    return (
      <div style={style}>
        <p style={{flex:'1'}}>Hello world</p>
        <FooterPanel />
      </div>
    );
  }
}

export default App;
