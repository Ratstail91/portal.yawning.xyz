import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Form, Button } from "semantic-ui-react";
import { validateEmail } from "../../../common/utilities.js";
import LinkButton from "../panels/link_button.jsx";

class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			retype: "",
			warning: ""
		}
	}

	componentDidMount() {
		//redirect if logged in (back to home)
		if (this.props.id) {
			this.props.history.push("/");
		}
	}

	//client-side validation
	setWarning(warning) {
		this.setState({
			warning: warning
		});
	}

	myClick(e) {
		if (!validateEmail(this.state.email)) {
			e.preventDefault();
			this.setWarning("Invalid Email");
			return;
		}

		if (this.state.password.length < 8) {
			e.preventDefault();
			this.setWarning("Minimum password length is 8 characters");
			return;
		}

		if (this.state.password !== this.state.retype) {
			this.setWarning("Passwords do not match");
			return;
		}
	}

	//field updaters
	updateEmail(evt) {
		this.setState({ email: evt.target.value });
	}
	updatePassword(evt) {
		this.setState({ password: evt.target.value });
	}
	updateRetype(evt) {
		this.setState({ retype: evt.target.value });
	}

	//finally
	render() {
		//only display if there's a warning
		let warningStyle = {
			display: this.state.warning.length > 0 ? "flex" : "none"
		};

		return ( //TODO: is the password safe?
			<div className="panel">
				<h1 className="ui centered">Sign Up</h1>
				<div className="warning" style={warningStyle}>
					<p>{this.state.warning}</p>
				</div>

				<Form action="/signup" method="post" onSubmit={(e) => this.myClick(e)}>
					<Form.Field>
						<label>Email</label>
						<input placeholder="your@email.com" type="text" name="email" value={this.state.email} onChange={this.updateEmail.bind(this)} />
					</Form.Field>
					<Form.Field>
						<label>Password</label>
						<input placeholder="Password" type="password" name="password" value={this.state.password} onChange={this.updatePassword.bind(this)} />
					</Form.Field>
					<Form.Field>
						<label>Retype Password</label>
						<input placeholder="Password" type="password" name="retype" value={this.state.retype} onChange={this.updateRetype.bind(this)} />
					</Form.Field>
					<Button type="submit" color="green">Submit</Button>
				</Form>
				<div className="ui centered">
					<Button.Group>
						<LinkButton to="/" color="green">Home</LinkButton>
						<LinkButton to="/login" color="green">Login</LinkButton>
					</Button.Group>
				</div>
			</div>
		);
	}
}

//redux
Signup.propTypes = {
	store: PropTypes.object.isRequired,
	id: PropTypes.number,
	history: PropTypes.object.isRequired
};

const mapStoreToProps = (store) => {
	return {
		store: store,
		id: store.profile.id
	};
}

const mapDispatchToProps = (dispatch) => {
	return {};
}

Signup = connect(mapStoreToProps, mapDispatchToProps)(Signup);

export default withRouter(Signup);