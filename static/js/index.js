var morse = new MorseCodec();
var morsePlayer = new MorseCodePlayer();

/** Web Audio API Analyser - related variables */
var bufferLength = _analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

/** Canvas-related variables */
var canvas = document.getElementById('inactive-visualize');
var canvasCtx = canvas.getContext("2d");

/** HTML elements */
var icons = document.querySelectorAll('#tones img');
var decodedLabel = document.getElementById('decoded-message');
var playedLabel = document.getElementById('played-message');
var playButton = document.getElementById('say-button');
var textInput = document.querySelector('#main input[type="text"]');

var code = '';
var played = '';
var toneIndex = 2;


function init() {
    icons[toneIndex].setAttribute('class', 'selected-tone');
    morsePlayer.loadSoundSet(toneIndex);
}

function chooseTone(idx) {
    if (idx === toneIndex) {
        return;
    }
    icons[toneIndex].setAttribute('class', 'tone');
    icons[idx].setAttribute('class', 'selected-tone');
    toneIndex = idx;
    morsePlayer.loadSoundSet(idx);
}

function updateLabels() {
    var code = decodedLabel.textContent;
    var played = playedLabel.textContent;

    played += code[0];
    code = code.slice(1);

    decodedLabel.textContent = code;
    playedLabel.textContent = played;

    if (code === '') {
        playButton.textContent = 'Say!';
    }
}

function play() {
    if (morsePlayer.isPlaying) {
        stop();
    }
    else {
        var message = textInput.value;
        if (message === '') {
            return;
        }
        code = morse.encode(message);
        decodedLabel.textContent = code;
        playedLabel.textContent = '';
        playButton.textContent = 'Stop';
        morsePlayer.playText(message, updateLabels);
        activateCanvas();
        draw();
    }
}

function stop() {
    playButton.textContent = 'Say!';
    morsePlayer.stop();
}

function activateCanvas() {
    canvas.setAttribute('id', 'active-visualize');
}

function deactivateCanvas() {
    canvas.setAttribute('id', 'inactive-visualize');
}

function draw() {
    if (!morsePlayer.isPlaying) {
        setTimeout(deactivateCanvas, 300);
        return;
    }

    requestAnimationFrame(draw);

    _analyser.getByteTimeDomainData(dataArray);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = 'rgb(255, 255, 0)';
    canvasCtx.beginPath();

    var sliceWidth = canvas.width * 1.0 / bufferLength;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0;
        var y = v * canvas.height / 2;
        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
};
