(function() {
	var aur = require('./js/auralizr.js');
	var auralizr = new aur();

	/*var impulseResponses = {
		'mausoleum' : 'http://notthetup.github.io/auralizr/audio/h.wav',
		'basement' : 'http://notthetup.github.io/auralizr/audio/s1.wav',
		'chapel' : 'http://notthetup.github.io/auralizr/audio/sb.wav',
		'stairwell' : 'http://notthetup.github.io/auralizr/audio/st.wav'
	}*/

	var impulseResponses = {
		'mausoleum' : 'https://dl.dropboxusercontent.com/u/957/IRs/converted/h.wav',
		'basement' : 'https://dl.dropboxusercontent.com/u/957/IRs/converted/s1.wav',
		'chapel' : 'https://dl.dropboxusercontent.com/u/957/IRs/converted/sb.wav',
		'stairwell' : 'https://dl.dropboxusercontent.com/u/957/IRs/converted/st.wav'
	}

	var allSpans = [].slice.call(document.getElementsByTagName('span'));
	allSpans.forEach(function(element) {
		element.addEventListener('click',function(event){
			auralizr.stop();
			auralizr.use(this.className);
			auralizr.start();
		}, false)
	})

	for( var key in impulseResponses){
		auralizr.load(impulseResponses[key], key, function (key){
			var span = document.getElementsByClassName(key)[0];
			if (span) console.log('enable span ' + key);
		});
	}

})();
