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
