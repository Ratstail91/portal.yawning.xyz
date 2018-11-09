import React from "react";

import LinkButton from "../panels/link_button.jsx";

import "../../styles/not_found.css";

class NotFound extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="ui centerScreen">
				<h1>Page not found!</h1>
				<LinkButton to="/" color="green">Return Home</LinkButton>
			</div>
		);
	}
}

export default NotFound;