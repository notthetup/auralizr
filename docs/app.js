import { Auralizr } from "./auralizr.js";

var aur = new Auralizr();
var impulseResponses = [
	{id: 'mausoleum', path: 'audio/h.wav', buffer: []},
	{id: 'basement', path: 'audio/s1.wav', buffer: []},
	{id: 'chapel', path: 'audio/sb.wav', buffer: []},
	{id: 'stairwell', path: 'audio/st.wav', buffer: []}
];

document.addEventListener('DOMContentLoaded', async () => {
	impulseResponses.forEach( async ir => {
		await loadIR(ir);
		let btn = document.getElementById(ir.id);
		btn.addEventListener('click', evt => {
			let el = btn.querySelector('.playpause');
			if (el.innerHTML === '▶'){
				resetAll();
				aur.setIR(ir.buffer);
				if (!aur.isRunning) aur.start();
				btn.classList.add('enabled');
				el.innerHTML = '❚❚';
			}else{
				aur.stop();
				resetAll();
			}
		});
		btn.querySelector('.playpause').innerHTML = '▶';
	});
});

function resetAll() {
	[].slice.call(document.getElementsByClassName('card')).forEach( el => {
		el.classList.remove('enabled');
		if (el.querySelector('.playpause').innerHTML === '❚❚') el.querySelector('.playpause').innerHTML = '▶';
	});
}

async function loadIR(ir){
	ir.buffer = await fetch(ir.path).then(res => res.arrayBuffer()).then(buf => aur.audioContext.decodeAudioData(buf))
}