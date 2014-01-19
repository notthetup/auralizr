(function() {
	var aur = require('./js/auralizr.js');
	var auralizr = new aur();
	auralizr.load("https://dl.dropboxusercontent.com/u/77191118/church_ir.wav", 'church', function (key){
			auralizr.use(key);
			auralizr.start();
	});
})();
