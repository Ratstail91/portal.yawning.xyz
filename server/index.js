//setup environment variables
require("dotenv").config({ path: "../.env" });

//express and server stuff
let express = require("express");
let app = express();
let http = require("http").Server(app);

//other tools
let path = require("path");

//handle the routes
app.use("/signup", require("./accounts/signup.js"));

//default access paths
app.use("/styles", express.static(path.resolve(process.env.PATH_CLIENT +  "/styles")));

app.get("/app.bundle.js", (req, res) => {
	res.sendFile(path.resolve(process.env.PATH_CLIENT + "/app.bundle.js"));
});

app.get("*", (req, res) => {
	res.sendFile(path.resolve(process.env.PATH_CLIENT + "/index.html"));
});

//open a connection
http.listen(process.env.SERVER_PORT, (req, res) => {
	console.log("Listening on port " + process.env.SERVER_PORT);
});