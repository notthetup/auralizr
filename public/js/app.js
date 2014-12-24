(function() {
	var Auralizr = require('lib/auralizr.js');
	var auralizr = new Auralizr();

	var impulseResponses = {
		'mausoleum' : 'audio/h.wav',
		'basement' : 'audio/s1.wav',
		'chapel' : 'audio/sb.wav',
		'stairwell' : 'audio/st.wav'
	};

	if (auralizr.userMediaSupport){
		for( var key in impulseResponses){
			auralizr.load(impulseResponses[key], key, function (key){
				var element = document.getElementsByClassName(key)[0];
				if (element) {
					enableClickFunctionality(element);
					element.innerHTML = '▶';
				}
			});
		}
	}

	function resetAllSpans() {
		var allPlaces =  [].slice.call(document.getElementsByClassName('place'));
		allPlaces.forEach(function(element) {
			element.classList.remove('enabled');
			if (element.innerHTML === '❚❚')
				element.innerHTML = '▶';
		});
	}

	function enableThisSpan(element){
		element.classList.add('enabled');
		element.innerHTML = '❚❚';
	}

	function enableClickFunctionality(element){
		element.addEventListener('click',function(event){
			auralizr.stop();
			if (element.innerHTML === '▶'){
				resetAllSpans();
				auralizr.use(this.id);
				auralizr.start();
				enableThisSpan(element);
			}else{
				// Pause
				resetAllSpans();
			}
		}, false);
	}
})();
