import React from "react";
import { Link } from "react-router-dom";

import "../../styles/not_found.css";

class NotFound extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="centerScreen">
				<h1>Page not found!</h1>
				<Link to="/">Return Home</Link>
			</div>
		);
	}
}

export default NotFound;