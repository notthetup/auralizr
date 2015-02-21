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
				this.faders[this.activeIndex].gain.setValueAtTime(1,this.audioContext.currentTime);
				this.faders[nextIndex].gain.setValueAtTime(0,this.audioContext.currentTime);

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
