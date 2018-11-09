import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Form, Button } from "semantic-ui-react";
import { validateEmail } from "../../../common/utilities.js";
import LinkButton from "../panels/link_button.jsx";
import { login } from "../actions/profile.js";

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			warning: ""
		};
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
		e.preventDefault();

		if (!validateEmail(this.state.email)) {
			this.setWarning("Invalid Email");
			return;
		}

		if (this.state.password.length < 8) {
			this.setWarning("Minimum password length is 8 characters");
			return;
		}

		let formData = new FormData();
		formData.append("email", this.state.email);
		formData.append("password", this.state.password);

		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = () => {
			if (xhttp.readyState === 4) {
				if (xhttp.status === 200) {
					let json = JSON.parse(xhttp.responseText);

					//login and switch to the root page
					this.props.login(json.id, json.token);
					this.props.history.push("/");
					return;
				}

				if (xhttp.status === 400) {
					this.setWarning(xhttp.responseText);
				}
			}
		};

		xhttp.open("POST", "/login", true);
		xhttp.send(formData);
	}

	//field updaters
	updateEmail(evt) {
		this.setState({ email: evt.target.value });
	}
	updatePassword(evt) {
		this.setState({ password: evt.target.value });
	}

	//finally
	render() {
		//only display if there's a warning
		let warningStyle = {
			display: this.state.warning.length > 0 ? "flex" : "none"
		};

		return (
			<div className="panel">
				<h1 className="ui centered">Sign Up</h1>
				<div className="warning" style={warningStyle}>
					<p>{this.state.warning}</p>
				</div>

				<Form action="/login" method="post" onSubmit={(e) => this.myClick(e)}>
					<Form.Field>
						<label>Email</label>
						<input placeholder="your@email.com" type="text" name="email" value={this.state.email} onChange={this.updateEmail.bind(this)} />
					</Form.Field>
					<Form.Field>
						<label>Password</label>
						<input placeholder="Password" type="password" name="password" value={this.state.password} onChange={this.updatePassword.bind(this)} />
					</Form.Field>
					<Button type="submit" color="green">Submit</Button>
				</Form>
				<div className="ui centered">
					<Button.Group>
						<LinkButton to="/" color="green">Home</LinkButton>
						<LinkButton to="/signup" color="green">Sign Up</LinkButton>
					</Button.Group>
				</div>
			</div>
		);
	}
}

Login.propTypes = {
	store: PropTypes.object.isRequired,
	id: PropTypes.number,
	history: PropTypes.object.isRequired,
	login: PropTypes.func.isRequired
};

const mapStoreToProps = (store) => {
	return {
		store: store,
		id: store.profile.id
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		login: (id, token) => dispatch(login(id, token))
	}
}

Login = connect(mapStoreToProps, mapDispatchToProps)(Login);

export default withRouter(Login);