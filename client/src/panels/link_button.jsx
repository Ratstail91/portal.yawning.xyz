//SOURCE: https://stackoverflow.com/questions/42463263/wrapping-a-react-router-link-in-an-html-button
//NOTE: this is a bonkers trick.

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from "semantic-ui-react";

const LinkButton = (props) => {
	const {
		history,
		location,
		match,
		staticContext,
		to,
		onClick,
		// ⬆ filtering out props that `button` doesn’t know what to do with.
		...rest
	} = props;

	rest.color = "green";

	return (
		<Button
			{...rest} // `children` is just another prop!
			onClick={(event) => {
				onClick && onClick(event)
				history.push(to)
			}}
		/>
	)
}

LinkButton.propTypes = {
	to: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired
};

export default withRouter(LinkButton);