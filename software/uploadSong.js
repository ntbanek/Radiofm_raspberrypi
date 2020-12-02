var musicDest = '/home/pi/Music/';
var path = require('path');
var toBase = require('../software/songToBase.js');

var multer = require('multer');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, musicDest);
	},
	filename: function (req, file, cb) {
		if (!file.originalname) {
			var err = new Error();
			err.code = 'filetype';
			return cb(err);
		} else {
			var day = new Date();
			var d = day.getDay();
			var h = day.getHours();
			var fileNamee = file.originalname.replace(/ /g, '');
			console.log("filename produced is: " + fileNamee);
			cb(null, fileNamee);
		}
	}
});


var upload = multer({
	storage: storage,
	limits: {
		fileSize: 20971520
	} // Max file size: 20MB
}).single('filepath'); // name in form


exports.uploadSong = function uploadSong(req, res) {
	upload(req, res, function (err) {
		if (err) {
			res.sendFile(path.resolve(__dirname + './../views/pathNotFind.html'));
		}
		if (!req.file) {
			res.sendFile(path.resolve(__dirname + './../views/wrongParams.html'));
		} else if (req.file && req.body.tit && req.body.art) {
			song = [musicDest + req.file.originalname.replace(/ /g, ''), req.body.tit, req.body.art, req.body.genn, req.body.ln];

			toBase.addSong(song);
			res.sendFile(path.resolve(__dirname + './../views/songAdded.html'));

		} else {
			const shell = require('shelljs');
			var comm = "cd /home/pi/Music/; rm '" + req.file.originalname.replace(/ /g, '') + "';";
			shell.exec(comm, function (error, stdout, stderr) {
				console.log("usunieto");
			});
			res.sendFile(path.resolve(__dirname + './../views/wrongParams.html'));
		}
	});
};