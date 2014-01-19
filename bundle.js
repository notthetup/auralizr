(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./js/auralizr.js":2}],2:[function(require,module,exports){
;(function(){

function auralizr() {
	var self = this;

	this.isMicEnabled = false;
	this.irArray = {};
	this.startRequest = false;

	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	this.audioContext = new AudioContext();
	this.convolver = this.audioContext.createConvolver();

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
	navigator.getUserMedia( {audio:true}, function (stream) {
		self.isMicEnabled = true;
		var mediaStreamSource = self.audioContext.createMediaStreamSource( stream );
		mediaStreamSource.connect(self.convolver);
		if (self.startRequest){
			self.start();
		}
	} );
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
	if (this.isMicEnabled && this.convolver.buffer !== null){
		console.log("Starting auralizr");
		this.convolver.connect(this.audioContext.destination);
		this.startRequest = false;
	}
	else
		console.log("Couldn't start the auralizr");
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



/*var convolver;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

// success callback when requesting audio input stream
function gotStream(stream) {
	// Create an AudioNode from the stream.
	var mediaStreamSource = audioContext.createMediaStreamSource( stream );

	convolver = audioContext.createConvolver();
	mediaStreamSource.connect(convolver);

	var ir_request = new XMLHttpRequest();
	ir_request.open("GET", "https://dl.dropboxusercontent.com/u/77191118/church_ir.wav", true);
	ir_request.responseType = "arraybuffer";
	ir_request.onload = function () {
		console.log("Download complete");
		convolver.buffer = audioContext.createBuffer(ir_request.response, false);
		document.getElementById('button').style.display = "";
	};
	ir_request.send();
	console.log("Downloading...");
	// Connect it to the destination to hear yourauralizr (or any other node for processing!)
}


function buttonClicked(){
	var button = document.getElementById('button');

	if(button.innerHTML == '▶'){
		button.innerHTML = '❚❚';
		convolver.connect( audioContext.destination );
	}else if(button.innerHTML == '❚❚'){
		button.innerHTML = '▶';
		convolver.disconnect();
	}
}*/

},{}]},{},[1])