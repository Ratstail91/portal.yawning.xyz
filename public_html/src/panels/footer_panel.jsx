import React from 'react';

class FooterPanel extends React.Component {
  render() {
    var style = {
      flex: '0 1 auto',
      justifySelf: 'flex-end',
      paddingTop: '2em',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    };

    return (
      <footer style={style}>
        <p>Copyright <a href='http://krgamestudios.com'>KR Game Studios</a> 2017-2018</p>
      </footer>
    );
  };
}

export default FooterPanel;
