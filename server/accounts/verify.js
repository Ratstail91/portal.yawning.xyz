let express = require("express");
let router = express.Router();

let database = require("../database/database.js");

router.get("/", (req, res) => {
	dbConnection = database.getConnection();

	let query = "SELECT salt, hash, verify FROM signups WHERE email = ? LIMIT 1;";
	dbConnection.query(query, [req.query.email], (err, results) => {
		if (err) throw err;

		if (results.length != 1) {
			res.end("That username does not exist or this link has already been used.");
			return;
		}

		if (req.query.verify != results[0].verify) {
			res.end("Verification failed!");
			return;
		}

		//move from signups to profiles
		let query = "INSERT INTO profiles (email, salt, hash) VALUES (?, ?, ?);";
		dbConnection.query(query, [req.query.email, results[0].salt, results[0].hash], (err) => {
			if (err) throw err;

			let query = "DELETE FROM signups WHERE email = ?;";
			dbConnection.query(query, [req.query.email], (err) => {
				if (err) throw err;
				res.end("Verification succeeded!");
			});
		});
	});
});

module.exports = router;