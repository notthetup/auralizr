(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function(){

	function Auralizr() {
		var self = this;
		this.userMediaSupport = false;
		this.isMicEnabled = false;
		this.irArray = {};
		this.startRequest = false;
		this.isRunning = false;

		this.decayDelay = 3;

		this.convolvers = [];
		this.faders = [];
		this.activeIndex = 0;

		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		this.audioContext = new AudioContext();

		// Two conolvers for cross fading
		this.convolvers[0] = this.audioContext.createConvolver();
		this.convolvers[1] = this.audioContext.createConvolver();

		this.convolvers[0].normalize = false;
		this.convolvers[1].normalize = false;

		this.faders[0] = this.audioContext.createGain();
		this.faders[1] = this.audioContext.createGain();

		this.convolvers[0].connect(this.faders[0]);
		this.convolvers[1].connect(this.faders[1]);

		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ;

		if (! navigator.getUserMedia){
			console.error('Unfortunately, your browser doesn\'t support the getUserMedia API needed for this expiriment. Try using Chrome instead');
			return null;
		}

		this.userMediaSupport = true;

		var constraints = {
		    mandatory: {
		      googEchoCancellation: false,
		      googAutoGainControl: false,
		      googNoiseSuppression: false,
		      googHighpassFilter: false
		    },
		    optional: []
		};
		navigator.getUserMedia( {audio: constraints}, function (stream) {
			self.isMicEnabled = true;
			var mediaStreamSource = self.audioContext.createMediaStreamSource( stream );
			mediaStreamSource.connect(self.convolvers[0]);
			mediaStreamSource.connect(self.convolvers[1]);
			if (self.startRequest){
				self.start();
			}
		} , function(){
			console.error("Error getting audio stream from getUserMedia");
		});
	}

	Auralizr.prototype.load= function(loadData, key, callback) {
		var self = this;
		if (typeof loadData == 'string'){
			//Loading from URL
			var ir_request = new XMLHttpRequest();
			ir_request.open("GET", loadData, true);
			ir_request.responseType = "arraybuffer";
			ir_request.onload = function () {
				self.audioContext.decodeAudioData( ir_request.response, function ( buffer ) {
					self.irArray[key] = buffer;
					if (typeof callback === 'function'){
						callback(key);
					}
				});
			};
			ir_request.send();
		}else if (loadData instanceof AudioBuffer){
			self.irArray[key] = loadData;
			callback(key);
		}
	};

	Auralizr.prototype.isReady= function(key) {
		return this.isMicEnabled && this.irArray.hasOwnProperty(key) && this.irArray[key] !== undefined;
	};

	Auralizr.prototype.use= function(key) {
		if ( this.irArray.hasOwnProperty(key) && this.irArray[key] !== undefined){

			if (this.isRunning){
				var nextIndex = +!this.activeIndex;

				this.convolvers[nextIndex].buffer = this.irArray[key];

				this.faders[this.activeIndex].gain.setTargetAtTime(0,this.audioContext.currentTime, this.decayDelay);
				this.faders[nextIndex].gain.setTargetAtTime(1,this.audioContext.currentTime,this.decayDelay);

				this.activeIndex = nextIndex;
			}else{
				this.convolvers[this.activeIndex].buffer = this.irArray[key];
			}
		}
	};

	Auralizr.prototype.start= function() {
		this.startRequest = true;
		if (!this.isMicEnabled){
			console.log("Couldn't start the Auralizr. Mic is not enabled");
			return;
		}
		if( this.convolvers[0].buffer === null && this.convolvers[1].buffer === null){
			console.log("Couldn't start the Auralizr. Buffer is not loaded");
			return;
		}

		this.faders[0].gain.setValueAtTime(0,this.audioContext.currentTime);
		this.faders[1].gain.setValueAtTime(0,this.audioContext.currentTime);

		this.faders[0].connect(this.audioContext.destination);
		this.faders[1].connect(this.audioContext.destination);

		this.faders[this.activeIndex].gain.setTargetAtTime(1,this.audioContext.currentTime,this.decayDelay);

		this.startRequest = false;
		this.isRunning = true;
	};

	Auralizr.prototype.stop= function() {
		this.startRequest = false;
		this.faders[0].disconnect();
		this.faders[1].disconnect();

		this.isRunning = false;

	};


	/**
	 * Expose `Auralizr`.
	 */

	if ('undefined' == typeof module) {
		window.Auralizr = Auralizr;
	} else {
		module.exports = Auralizr;
	}

})();

},{}],2:[function(require,module,exports){
(function() {
	var Auralizr = require('../../lib/auralizr.js');
	var auralizr = new Auralizr();

	var impulseResponses = {
		'mausoleum' : 'public/audio/h.wav',
		'basement' : 'public/audio/s1.wav',
		'chapel' : 'public/audio/sb.wav',
		'stairwell' : 'public/audio/st.wav'
	};

	if (auralizr.userMediaSupport){
		var onAuralizrLoad = function (key){
				var element = document.getElementsByClassName(key)[0];
				if (element) {
					enableClickFunctionality(element);
					element.innerHTML = '▶';
				}
			};
		for( var key in impulseResponses){
			auralizr.load(impulseResponses[key], key, onAuralizrLoad);
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

			if (element.innerHTML === '▶'){
				resetAllSpans();
				auralizr.use(this.id);
				if (!auralizr.isRunning){
					auralizr.start();
				}
				enableThisSpan(element);
			}else{
				// Pause
				auralizr.stop();
				resetAllSpans();
			}
		}, false);
	}
})();

},{"../../lib/auralizr.js":1}]},{},[2])