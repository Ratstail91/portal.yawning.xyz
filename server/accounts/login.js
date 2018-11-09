let express = require("express");
let router = express.Router();
let formidable = require("formidable");
let bcrypt = require("bcrypt");

let utils = require("../../common/utilities.js");
let database = require("../database/database.js");

router.post("/", (req, res) => {
	dbConnection = database.getConnection();

	let form = formidable.IncomingForm();

	form.parse(req, (err, fields) => {
		if (err) throw err;

		if (!utils.validateEmail(fields.email) || fields.password.length < 8) {
			res.end("Invalid login form credentials");
			return;
		}

		//find this email's information
		let query = "SELECT id, salt, hash FROM profiles WHERE email = ? LIMIT 1;";
		dbConnection.query(query, [fields.email], (err, results) => {
			if (err) throw err;

			if (results.length === 0) {
				res.status(400).end("Incorrect email or password");
				return;
			}

			//gen a new hash
			bcrypt.hash(fields.password, results[0].salt, (err, hash) => {
				if (hash !== results[0].hash) {
					res.status(400).end("Incorrect email or password");
					return;
				}

				//create and store the login token
				//TODO: multiple login tokens
				let rand = Math.floor(Math.random() * 65535);

				let query = "UPDATE profiles SET lastToken = ? WHERE email = ?;";
				dbConnection.query(query, [rand, fields.email], (err) => {
					if (err) throw err;

					res.status(200)
						.json({
							id: results[0].id,
							token: rand
						})
						.end();
				});
			});
		});
	});
});

module.exports = router;