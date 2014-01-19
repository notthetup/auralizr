;(function(){

	function auralizr() {
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

		//this.userMediaSupport = true;

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

	auralizr.prototype.load= function(irURL, key, callback) {
		var self = this;

		var ir_request = new XMLHttpRequest();
		ir_request.open("GET", irURL, true);
		ir_request.responseType = "arraybuffer";
		ir_request.onload = function () {
			self.irArray[key] = self.audioContext.createBuffer(ir_request.response, false);
			callback(key);
		};
		ir_request.send();
	};

	auralizr.prototype.isReady= function(key) {
		return this.isMicEnabled && this.irArray.hasOwnProperty(key) && this.irArray[key] !== undefined;
	};

	auralizr.prototype.use= function(key) {
		if ( this.irArray.hasOwnProperty(key) && this.irArray[key] !== undefined)
			this.convolver.buffer = this.irArray[key];
	};

	auralizr.prototype.start= function() {
		this.startRequest = true;
		if (!this.isMicEnabled){
			console.log("Couldn't start the auralizr. Mic is not enabled");
			return;
		}
		if( this.convolver.buffer === null){
			console.log("Couldn't start the auralizr. Buffer is not loaded");
			return;
		}

		console.log("Starting auralizr");
		this.convolver.connect(this.audioContext.destination);
		this.startRequest = false;

	};

auralizr.prototype.stop= function() {
	this.startRequest = false;
	console.log("Stopping auralizr");
	this.convolver.disconnect();
};


/**
	 * Expose `auralizr`.
	 */

	if ('undefined' == typeof module) {
		window.auralizr = auralizr;
	} else {
		module.exports = auralizr;
	}

	})();
