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
			if (element.innerHTML === '▶'){
				// Play
				resetAllSpans();
				auralizr.use(this.className);
				auralizr.start();
				enableThisSpan(element);
			}else{
				// Pause
				resetAllSpans();
			}
		}, false)
	})

	function resetAllSpans() {
		allSpans.forEach(function(element) {
			element.classList.remove('enabled');
			element.innerHTML = '▶';
		});
	}

	function enableThisSpan(element){
		element.classList.add('enabled');
		element.innerHTML = '❚❚';
	}

	for( var key in impulseResponses){
		auralizr.load(impulseResponses[key], key, function (key){
			var span = document.getElementsByClassName(key)[0];
			if (span) console.log('enable span ' + key);
		});
	}

})();
