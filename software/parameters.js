

exports.pref_params = function pref_params(flag) {
	var today = new Date();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var random_nr = Math.floor(Math.random() * 11); //od 0 do 10 random 
	// });
	var hour = today.getHours();

	if (hour >= 6 && hour <= 9) {
		var bpm_MAX = "(SELECT MAX(bpm) FROM music_base)";
		var bpm_MIN = 130;
		if (random_nr > 7) {
			var genre_pref = " AND ( genre = 'rock') ";
		} else if (random_nr < 3) {
			var genre_pref = " AND ( genre = 'metal') ";
		} else {
			var genre_pref = "";
		}
	} else if (hour >= 10 && hour <= 15) {
		var bpm_MAX = 120;
		var bpm_MIN = 90;
		if (random_nr > 7) {
			var genre_pref = " AND ( genre = 'pop') ";
		} else {
			var genre_pref = "";
		}
	} else if (hour >= 16 && hour <= 18) {
		var bpm_MAX = 135;
		var bpm_MIN = 110;
		var genre_pref = "";
	} else if (hour >= 19 && hour <= 23) {
		var bpm_MAX = 100;
		var bpm_MIN = 80;
		var genre_pref = "";
	} else {
		var bpm_MAX = 90;
		var bpm_MIN = "(SELECT MIN(bpm) FROM music_base)";
		if (random_nr > 6) {
			var genre_pref = " AND ( genre = 'poetry') ";
		} else {
			var genre_pref = "";
		}
	}

	if (flag === 1) {
		if (random_nr >= 7) {
			var bpm_MAX = "(SELECT MAX(bpm) FROM music_base)";
			var bpm_MIN = "(SELECT MIN(bpm) FROM music_base)";
		} else {
			var genre_pref = "";
		}

	}
	return [bpm_MIN, bpm_MAX, genre_pref];
}

