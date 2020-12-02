var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "rpi",
	password: "pi",
	database: "radio"
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});

exports.con = con;