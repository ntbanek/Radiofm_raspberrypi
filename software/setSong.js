var Database = require('./connection.js');


var count = 0;
var if_30 = false;
var repeat = 0;


Database.con.query('TRUNCATE TABLE playlist', function (err) {
	select_song();
});


function select_song() {
	var parameters = require('./parameters.js');
	repeat++;
	console.log(count);
	if (repeat >= 15) {
		var bpm_values = parameters.pref_params(1);
	} else {
		var bpm_values = parameters.pref_params(0);
	}
	console.log(repeat);

	check_language().then(function (ln) {

		var language = ln;

		console.log(language);

		var command_sel = selection(bpm_values, language);
		console.log(command_sel);
		Database.con.query(command_sel, function (err, rows) {

			var command_check = "SELECT path, title, artist, bpm, genre, polish FROM playlist WHERE path= \"" + rows[0].path + "\"";
			console.log(command_check);
			Database.con.query(command_check, function (err, similiar) {
				if (similiar[0]) {
					select_song();
				} else {
					console.log(rows[0].title);
					var command_ins = "INSERT INTO playlist (path, title, artist, bpm, genre, polish) VALUES ('" + rows[0].path + "', '" + rows[0].title + "', '" + rows[0].artist + "', '" + rows[0].bpm + "', '" + rows[0].genre + "', '" + rows[0].polish + "')";
					Database.con.query(command_ins, function (err, result) {

						console.log("1 record inserted");
						repeat = 0;

						if (count === 0) {
							count++;
							select_song();
						} else if (count === 5) {
							if_30 = true;
							play_song();
						} else {
							count++;
							play_song();
						}
					});
				}
			});
		});
	})
}

function play_song() { //2,1 - trzecia piosenka
	//1,1 - druga piosenka
	//1 - pierwsza piosenka

	console.log("count na ten moment wynosi" + count);
	if (count === 2) {
		var command_play = "SELECT path, title, artist, bpm, genre, polish FROM playlist LIMIT 1";

	} else {
		var command_play = "SELECT path, title, artist, bpm, genre, polish FROM playlist LIMIT " + (count - 2) + ",1";

	}
	clean_playlist();
	Database.con.query(command_play, function (err, play) {
		if (err) throw err;


		const {
			exec
		} = require('child_process');
		var exec_piFm = "cd /home/pi/PiFmRds/src; sox -t mp3 " + play[0].path + " -t wav - | sudo ./pi_fm_rds -freq " + process.argv[2] + " -ps RADIO -rt \"" + play[0].artist + "\" -audio -";
		console.log(exec_piFm);
		exec(exec_piFm, (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);

			}
			console.log(stdout);
			console.log(stderr);

			select_song();
		});

	});

}

function clean_playlist() {
	if (if_30 === true) {
		Database.con.query('DELETE FROM playlist LIMIT 1', function (err) {});
	}
}

function check_language() {
	return new Promise((resolve, reject) => {
		Database.con.query('SELECT * FROM playlist ORDER BY id DESC LIMIT 3', function (err, res) {
			if (err) reject(err);
			for (i = 0; i <= 2; i++) {
				if (res[i]) {
					if (res[i].polish === "Y" && count >= 3) {
						var ln = 0;
					} else if (count < 3) {
						var ln = 0
					} else {
						var ln = 1;
					}
				}
			}
			resolve(ln);
		});
	});
};


function selection(bpm_values, language) {
	if (language === 1) {
		var ln_param = " AND (polish = 'Y') ";
	} else {
		var ln_param = " ";
	}
	var command_sel = "SELECT path, title, artist, bpm, genre, polish FROM music_base WHERE (bpm BETWEEN " + bpm_values[0] + " AND " + bpm_values[1] + ")" + ln_param + "" + bpm_values[2] + "ORDER BY RAND() LIMIT 1";
	return command_sel;
}