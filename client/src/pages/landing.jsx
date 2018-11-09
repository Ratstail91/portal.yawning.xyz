import React from "react";
import { Button } from "semantic-ui-react";
import LinkButton from "../panels/link_button.jsx";

class Landing extends React.Component {
	constructor(props) {
		super(props);
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

export default Landing;