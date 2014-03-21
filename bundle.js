(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./js/auralizr.js":2,"./js/irgen.js":3}],2:[function(require,module,exports){
;(function(){

	function Auralizr() {
		var self = this;
		this.userMediaSupport = false;
		this.isMicEnabled = false;
		this.irArray = {};
		this.startRequest = false;

		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		this.audioContext = new AudioContext();
		this.convolver = this.audioContext.createConvolver();

		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ;

		if (! navigator.getUserMedia){
			console.log('Unfortunately, your browser doesn\'t support the getUserMedia API needed for this expiriment. Try using Chrome instead');
			return null;
		}

		this.userMediaSupport = true;

		navigator.getUserMedia( {audio:true}, function (stream) {
			self.isMicEnabled = true;
			var mediaStreamSource = self.audioContext.createMediaStreamSource( stream );
			mediaStreamSource.connect(self.convolver);
			if (self.startRequest){
				self.start();
			}
		} , function(){
			console.log("Error getting audio stream from getUserMedia");
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
					callback(key);
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
		if ( this.irArray.hasOwnProperty(key) && this.irArray[key] !== undefined)
			this.convolver.buffer = this.irArray[key];
	};

	Auralizr.prototype.start= function() {
		this.startRequest = true;
		if (!this.isMicEnabled){
			console.log("Couldn't start the Auralizr. Mic is not enabled");
			return;
		}
		if( this.convolver.buffer === null){
			console.log("Couldn't start the Auralizr. Buffer is not loaded");
			return;
		}

		console.log("Starting Auralizr");
		this.convolver.connect(this.audioContext.destination);
		this.startRequest = false;

	};

	Auralizr.prototype.stop= function() {
		this.startRequest = false;
		console.log("Stopping Auralizr");
		this.convolver.disconnect();
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

},{}],3:[function(require,module,exports){
;(function(){

	function IRGen() {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		this.audioContext = new AudioContext();
	}

	IRGen.prototype.getBuffer = function( delayInSamples, length ){
		if (!length)
			length = 256;
		if (!delayInSamples)
			delayInSamples = 0;

		var array = new Float32Array(length);
		array[delayInSamples] = 1;

		var audioBuf = this.audioContext.createBuffer(2,length,44100);

		audioBuf.getChannelData(0).set(array);
		audioBuf.getChannelData(1).set(array);

		return audioBuf;
	};

	/**
	 * Expose `Auralizr`.
	 */

	if ('undefined' == typeof module) {
		window.IRGen = IRGen;
	} else {
		module.exports = IRGen;
	}
})();

},{}]},{},[1])