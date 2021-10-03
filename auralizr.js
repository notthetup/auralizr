export class Auralizr {

	constructor(){

		this.convolvers = [];
		this.faders = [];
		this.activeIndex = 0;
		this.decayDelay = 3;

		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		this.audioContext = new AudioContext();

		this.convolvers[0] = this.audioContext.createConvolver();
		this.convolvers[1] = this.audioContext.createConvolver();

		this.convolvers[0].normalize = false;
		this.convolvers[1].normalize = false;

		this.faders[0] = this.audioContext.createGain();
		this.faders[1] = this.audioContext.createGain();

		this.faders[0].gain.value = 0;
		this.faders[1].gain.value = 0;

		this.convolvers[0].connect(this.faders[0]);
		this.convolvers[1].connect(this.faders[1]);

		this.faders[0].connect(this.audioContext.destination);
		this.faders[1].connect(this.audioContext.destination);

		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
			console.error('Unfortunately, your browser doesn\'t support the getUserMedia API. You may switch to Google Chrome and if you\'re already on Chrome, you might need to turn on some flags. https://developers.google.com/web/updates/2015/10/media-devices?hl=en');
			return null;
		}

		var constraints = {
			echoCancellation: false,
			autoGainControl: false,
			noiseSuppression: false
		};
		navigator.mediaDevices.getUserMedia( {audio: constraints, video:false}).then((stream) => {
			this.isMicEnabled = true;
			var mediaStreamSource = this.audioContext.createMediaStreamSource( stream );
			mediaStreamSource.connect(this.convolvers[0]);
			mediaStreamSource.connect(this.convolvers[1]);
		}).catch(err =>{
			console.error("Error getting audio stream from getUserMedia. Make sure you're on https." + err );
			return null;
		});
	}

	setIR(irBuffer){
		if (this.isRunning){
			var nextIndex = +!this.activeIndex;

			this.convolvers[nextIndex].buffer = irBuffer;

			this.faders[this.activeIndex].gain.setTargetAtTime(0,this.audioContext.currentTime, this.decayDelay);
			this.faders[nextIndex].gain.setTargetAtTime(1,this.audioContext.currentTime,this.decayDelay);

			this.activeIndex = nextIndex;
		}else{
			this.convolvers[this.activeIndex].buffer = irBuffer;
		}
	}

	start(){
		if (!this.isMicEnabled){
			console.log("Couldn't start the Auralizr. Mic is not enabled");
			return;
		}
		this.faders[this.activeIndex].gain.setTargetAtTime(1,this.audioContext.currentTime,this.decayDelay);
		this.faders[+!this.activeIndex].gain.setValueAtTime(0,this.audioContext.currentTime);
	
		if (!this.isRunning) this.audioContext.resume();
		this.isRunning = true;
	}

	stop(){
		this.faders[0].gain.value = 0;
		this.faders[0].gain.value = 0;
		this.isRunning = false;
	}
}