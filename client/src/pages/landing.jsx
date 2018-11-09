import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import LinkButton from "../panels/link_button.jsx";
import PropTypes from "prop-types";

class Landing extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		//redirect if logged in (onwards to profile)
		if (this.props.id) {
			this.props.history.push("/profile");
		}
	}

	render() {
		return (
			<div>
				<h1 className="ui centered">Welcome to Yawning.xyz!</h1>
				<p>The Yawning Portal is a popular tavern in the city of Waterdeep, where adventurers from all over the Forgotten Realms and beyond gather to drink, trade stories of epic heroism, and gather intel on various goings on that may lead an adventurer to riches beyond their wildest dreams.</p>
				<p>This is not The Yawning Portal.</p>
				<p>Yawning.xyz is a social media website created by one man in his mother's basement for use by his D&D playgroup. All are welcome here, but please be respectful of others, and don't make a mess on the carpet.</p>
				<div className="ui centered">
					<Button.Group>
						<LinkButton to="/login" color="green">Login</LinkButton>
						<LinkButton to="/signup" color="green">Sign Up</LinkButton>
						<LinkButton to="/resetpassword" color="green">Reset Password</LinkButton>
					</Button.Group>
				</div>
			</div>
		);
	}
}

Landing.propTypes = {
	store: PropTypes.object.isRequired,
	id: PropTypes.number,
	history: PropTypes.object.isRequired
}

const mapStoreToProps = (store) => {
	return {
		store: store,
		id: store.profile.id
	};
}

const mapDispatchToProps = (dispatch) => {
	return {};
}

Landing = connect(mapStoreToProps, mapDispatchToProps)(Landing);

export default withRouter(Landing);