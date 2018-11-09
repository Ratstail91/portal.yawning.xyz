import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

//include other pages
import Landing from "./pages/landing.jsx";
import Signup from "./pages/signup.jsx";
import Login from "./pages/login.jsx";
import NotFound from "./pages/not_found.jsx";

//include panels
import Footer from "./panels/footer.jsx";

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="central">
				<div className="panel">
					<BrowserRouter>
						<Switch>
							<Route exact path="/" component={ Landing } />
							<Route exact path="/signup" component={ Signup } />
							<Route exact path="/login" component={ Login } />
							<Route exact path="*" component={ NotFound } />
						</Switch>
					</BrowserRouter>
				</div>
				<Footer />
			</div>
		);
	}
}

export default App;