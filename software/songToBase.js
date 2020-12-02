var Database = require('./connection.js');
const NodeID3 = require('node-id3')
const fs = require('fs')

exports.addSong = function (song) {

	var command = "bpm-tag " + song[0];
	const shell = require('shelljs')
	shell.exec(command, function (error, stdout, stderr) {

		var read = NodeID3.read(song[0], {
			rawTags: true
		});
		//returns tags
		console.log(read.raw["TBPM"]);
		var bmp = read.raw["TBPM"];

		var sql = "INSERT INTO music_base (path, title, artist, bpm, genre, polish) VALUES ('" + song[0] + "', '" + song[1] + "', '" + song[2] + "', '" + bmp + "', '" + song[3] + "', '" + song[4] + "')";
		Database.con.query(sql, function (err, result) {
			if (err) {
				console.log(err);
				throw err;

			}
			console.log(stdout);
			console.log("1 record inserted");

		});
	});
}