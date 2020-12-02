

exports.searchSelection = function (req) {
	var selection = "SELECT title, artist, bpm, genre, polish FROM music_base WHERE";

	if (req.body.tit) {
		selection += " title = \"" + req.body.tit + "\"";
	} else {
		selection += " title = title";
	}
	if (req.body.art) {
		selection += " AND artist = \"" + req.body.art + "\"";
	} else {
		selection += " AND artist = artist"
	}
	if (req.body.genn) {
		selection += " AND genre = \"" + req.body.genn + "\"";
	} else {
		selection += " AND genre = genre";
	}
	if (req.body.ln) {
		selection += " AND polish = \"" + req.body.ln + "\"";
	} else {
		selection += " AND polish = polish";
	}

	return selection;
}


exports.search = function searchFun(selection, res) {
	var command = "cd views; cp base.html base_response.html";
	const shell = require('shelljs')
	shell.exec(command, function (error, stdout, stderr) {


		const path = require('path');
		const fs = require('fs');

		var Database = require('../software/connection.js');
		var tables = "";
		Database.con.query(selection, function (err, result) {

			var count_res = Object.keys(result).length;
			console.log(count_res);


			if (count_res > 0) {

				tables += " <tr style=\"width: 70px;\"><th>L.p.</th><th>Tytuł</th><th>Wykonawca</th><th>Gatunek</th><th>Język</th></th>";
			} else {
				tables += "<tr style=\"width: 70px;\"><th> Nie ma utworów o zadanych parametrach w bazie</th> </tr>";
			}


			for (i = 0; i < count_res; i++) {
				tables += " <tr style=\"width: 70px;\"> <td>" + (i + 1) + "</td>"
				tables += "  <td>" + result[i].title + "</td>"
				tables += "  <td>" + result[i].artist + "</td>"
				if (result[i].genre === "poetry") {
					result[i].genre = "ballada";
				}

				tables += "  <td>" + result[i].genre + "</td>"

				if (result[i].polish === "Y") {
					result[i].polish = "polski";
				} else {
					result[i].polish = "inny";
				}
				tables += "  <td>" + result[i].polish + "</td></tr>"
			}

			fs.readFile(path.resolve(__dirname + './../views/base_response.html'), 'utf8', function (err, data) {
				if (err) {
					return console.log(err);
				}

				var replacing = data.replace(/width=\"550\"\>.\<\/table\>/g, 'width=\"550\"\>' + tables + '\<\/table\>');

				fs.writeFile(path.resolve(__dirname + './../views/base_response.html'), replacing, 'utf8', function (err) {
					if (err) return console.log(err);

					res.sendFile(path.resolve(__dirname + './../views/base_response.html'));
				});

			});
		});
	})
}

