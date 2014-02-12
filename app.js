(function() {
	var Auralizr = require('./js/auralizr.js');
	var IRGen = require('./js/irgen.js');
	var auralizr = new Auralizr();
	var irgen = new IRGen();

	var impulseResponses = {
		'mausoleum' : 'https://dl.dropboxusercontent.com/u/957/IRs/converted/h.wav',
		'basement' : 'https://dl.dropboxusercontent.com/u/957/IRs/converted/s1.wav',
		'chapel' : 'https://dl.dropboxusercontent.com/u/957/IRs/converted/sb.wav',
		'stairwell' : 'https://dl.dropboxusercontent.com/u/957/IRs/converted/st.wav'
	};

	if (auralizr.userMediaSupport){
		for( var key in impulseResponses){
			auralizr.load(impulseResponses[key], key, function (key){
			//auralizr.load(irgen.getBuffer(10), key, function (key){
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
