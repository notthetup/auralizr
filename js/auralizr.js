function auralizr() {
	var isMicEnabled = false;

	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	var audioContext = new AudioContext();
	convolver = audioContext.createConvolver();

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
	navigator.getUserMedia( {audio:true}, gotStream );

	var mediaStreamSource = audioContext.createMediaStreamSource( stream );
	mediaStreamSource.connect(convolver);
	isMicEnabled = true;
}

auralizr.prototype.load= function(irURL, key, callback) {
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
	return self.isMicEnabled && self.irArray.hasOwnProperty(key) && self.irArray[key] !== undefined;
};

auralizr.prototype.use= function(key) {
	if ( self.irArray.hasOwnProperty(key) && self.irArray[key] !== undefined)
		self.convolver.buffer = self.irArray[key];
};

auralizr.prototype.start= function() {
	if (self.isMicEnabled && self.convolver.buffer !== null)
		self.convolver.connect(self.audioContext.destination);
};

auralizr.prototype.stop= function() {
	self.convolver.disconnect();
};


modules.export = auralizr;



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
	// Connect it to the destination to hear yourself (or any other node for processing!)
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
