var morse = new MorseCodec();
var morsePlayer = new MorseCodePlayer();

var code = '';
var played = '';
var toneIndex = 2;

function init() {
    var icons = document.getElementsByClassName('tone');
    icons[toneIndex].setAttribute('class', 'selected-tone');
    morsePlayer.loadSoundSet(toneIndex);
}

function chooseTone(idx) {
    if (idx === toneIndex) {
        return;
    }
    var icons = document.querySelectorAll('#tones img');
    icons[toneIndex].setAttribute('class', 'tone');
    icons[idx].setAttribute('class', 'selected-tone');
    toneIndex = idx;
    morsePlayer.loadSoundSet(idx);
}

function updateLabels() {
    var code = document.getElementById('decoded-message').textContent;
    var played = document.getElementById('played-message').textContent;

    played += code[0];
    code = code.slice(1);

    document.getElementById('decoded-message').textContent = code;
    document.getElementById('played-message').textContent = played;

    if (code === '')
        document.getElementById('say-button').textContent = 'Say!';
}

function play() {
    if (morsePlayer.isPlaying) {
        stop();
    }
    else {
        var message = document.querySelector('#main input[type="text"]').value;
        code = morse.encode(message);
        document.getElementById('decoded-message').textContent = code;
        document.getElementById('played-message').textContent = '';
        document.getElementById('say-button').textContent = 'Stop';
        morsePlayer.playText(morse.encodeWithSpacing(message), updateLabels);
    }
}

function stop() {
    document.getElementById('say-button').textContent = 'Say!';
    morsePlayer.stop();
}
