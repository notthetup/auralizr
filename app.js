(function() {
	var aur = require('./js/auralizr.js');
	var auralizr = new aur();

	var impulseResponses = {
		'mausoleum' : 'http://notthetup.github.io/auralizr/audio/h.wav',
		'basement' : 'http://notthetup.github.io/auralizr/audio/s1.wav',
		'chapel' : 'http://notthetup.github.io/auralizr/audio/sb.wav',
		'stairwell' : 'http://notthetup.github.io/auralizr/audio/st.wav'
	}

	var allSpans = [].slice.call(document.getElementsByTagName('span'));
	allSpans.forEach(function(element) {
		element.addEventListener('click',function(event){
			auralizr.stop();
			auralizr.use(this.class);
			auralizr.start();
		}, false)
	})

	for( var key in impulseResponses){
		auralizr.load(impulseResponses[key], key, function (key){
			var span = document.getElementsByClass(key)[0];
			if (span) console.log('enable span ' + key);
		});
	}

})();
