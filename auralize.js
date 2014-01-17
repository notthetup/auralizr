var convolver;
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
        document.getElementById('button').style.display = ""
    }
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
}
