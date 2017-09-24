import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import OptionsPanel from '../panels/options_panel.jsx';

class PageProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      warning: ''
    };
  };

  componentDidMount() {
    //redirect if NOT logged in (back to home)
    if (!this.props.token) {
      this.props.history.push('/');
    }
  }

  setWarning(s) {
    this.setState({
      warning: s
    });
  }

  render() {
    //styles
    var warningStyle = {
      display: this.state.warning.length > 0 ? 'flex' : 'none'
    };

    var padStyle = {
      flex: '1'
    };

    //custom display
    var customLinks = (
      <div>
        <p><Link to='/passwordchange'>Change Password</Link></p>
      </div>
    );

    return (
      <div className='page'>
        <h1 className='centered'>Profile</h1>
        <div className='warning' style={warningStyle}>
          <p>{this.state.warning}</p>
        </div>
        <div className="sexyLayout">
          <div>
            <OptionsPanel custom={customLinks} />
            <div style={padStyle}></div>
          </div>
          <div style={{flex: '1', borderStyle: 'solid'}}>Placeholder</div>
        </div>
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
    //
  };
}

PageProfile = connect(mapStoreToProps, mapDispatchToProps)(PageProfile);

export default withRouter(PageProfile);
