(function() {
	var aur = require('./js/auralizr.js');
	var auralizr = new aur();

	var impulseResponses = {
		'mausoleum' : 'https://dl.dropboxusercontent.com/u/957/IRs/converted/h.wav',
		'basement' : 'https://dl.dropboxusercontent.com/u/957/IRs/converted/s1.wav',
		'chapel' : 'https://dl.dropboxusercontent.com/u/957/IRs/converted/sb.wav',
		'stairwell' : 'https://dl.dropboxusercontent.com/u/957/IRs/converted/st.wav'
	}

	var allButtons = [].slice.call(document.getElementsByTagName('button'));
	allButtons.forEach(function(element) {
		element.addEventListener('click',function(event){
			auralizr.stop();
			auralizr.use(this.id.replace(/_button$/,''));
			auralizr.start();
		}, false)
	})



	for( var key in impulseResponses){
		auralizr.load(impulseResponses[key], key, function (key){
			var button = document.getElementById(key+"_button");
			if (button) button.disabled = false;
		});
	}

})();
