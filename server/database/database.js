require("dotenv").config({ path: "../../.env" });
let mysql = require("mysql");

//create the database connection
let dbConnection;

let dbConfig = {
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	database: process.env.DATABASE_NAME
};

//call this on failure
let handleDisconnect = () => {
	dbConnection = mysql.createConnection(dbConfig);

	dbConnection.connect((err) => {
		if (err) {
			console.log("error when connecting to mysql: ", err);
			setTimeout(handleDisconnect, 2000);
			return;
		}

		dbConnection.query(`USE ${dbConfig.database};`, (err) => {
			if (err) throw err;
			console.log("connected to mysql");
		})
	});

	dbConnection.on("error", (err) => {
		console.log("database error: ", err);
		if (err.code === "PROTOCOL_CONNECTION_LOST") {
			handleDisconnect();
		} else {
			throw err;
		}
	});
}

handleDisconnect();

let getConnection = () => {
	return dbConnection;
}

module.exports = {
	handleDisconnect,
	getConnection
};