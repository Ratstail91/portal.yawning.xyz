require("dotenv").config({ path: "../../.env" });
let express = require("express");
let router = express.Router();
let formidable = require("formidable");
let bcrypt = require("bcrypt");
let sendmail = require("sendmail")({silent: true});

let utils = require("../../common/utilities.js");
let database = require("../database/database.js");

router.post("/", (req, res) => {
	dbConnection = database.getConnection();

	//formidable handles forms
	let form = formidable.IncomingForm();

	form.parse(req, (err, fields) => {
		if (err) throw err;
		if (!utils.validateEmail(fields.email) || fields.password.length < 8 || fields.password !== fields.retype) {
			res.end("Error parsing the signup form data");
			return;
		}

		//check if the email already exists
		let query = "SELECT COUNT(*) AS count FROM profiles WHERE email = ?;";
		dbConnection.query(query, [fields.email], (err, results) => {
			if (err) throw err;

			if (results[0].count !== 0) {
				res.end("Error checking uniqueness of the email");
				return;
			}

			bcrypt.genSalt(11, (err, salt) => {
				if (err) throw err;
				bcrypt.hash(fields.password, salt, (err, hash) => {
					if (err) throw err;

					//store teh email, salt, hash and rand values
					let rand = Math.floor(Math.random() * 65535);
					let query = "REPLACE INTO signups (email, salt, hash, verify) VALUES (?, ?, ?, ?);";
					dbConnection.query(query, [fields.email, salt, hash, rand], (err) => {
						if (err) throw err;

						//send the verification email
						let addr = `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/verify?email=${fields.email}&verify=${rand}`;
						let msg = "Hello! Please visit the following address to verify your email: ";

						let msgHTML = `<html><body><p>${msg}<a href=${addr}>${addr}</a></p></body></html>`;

						sendmail({
							secure: true,
							tls: {
								rejectUnauthorized: false
							},
							from: "signup@yawning.xyz",
							to: fields.email,
							subject: "Email Verification",
							text: msg + addr,
							html: msgHTML,
						}, (err, reply) => {
							if (err) {
								res.end("Unknown error occurred (Did you use a valid email?): " + err);
								return;
							}

							res.end("Verification email sent");
						});
					});
				});
			});
		});
	});
});

module.exports = router;