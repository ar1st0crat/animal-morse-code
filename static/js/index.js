alphabet = {
    // letters:
    'a': '.-',   'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.',
    'f': '..-.', 'g': '--.',  'h': '....', 'i': '..',  'j': '.---',
    'k': '-.-',  'l': '.-..', 'm': '--',   'n': '-.',  'o': '---',
    'p': '.--.', 'q': '--.-', 'r': '.-.',  's': '...', 't': '-',
    'u': '..-',  'v': '...-', 'w': '.--',  'x': '-..-','y': '-.--', 'z': '--..',
    // digits:
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    // misc:
    '.': '.-.-.-', ',': '--..--', '?': '..--..',  '\'': '.----.',
    '/': '-..-.',  '(': '-.--.',  ')': '-.--.-',  '&': '.-...',
    ':': '---...', ';': '-.-.-.', '=': '-...-',   '+': '.-.-.',
    '-': '-....-', '-': '..--.-', '\"': '.-..-.', '$': '...-..-',
    '!': '-.-.--', '@': '.--.-.'
};

isPlaying = false;
morseCode = '';
letterIndex = 0;

function encode(text) {
    return [].map.call(text.toLowerCase(),
        function(s) {
            return alphabet[s];
        })
        .join(' ');
}

function playMessage() {
    var code = document.getElementById('decoded-message').textContent;
    var played = document.getElementById('played-message').textContent;

    if (code.length === 0 || !isPlaying) {
        stop();
        return;
    }

    playSound(code[0]);
    
    played += code[0];
    code = code.replace(code[0], '');

    document.getElementById('decoded-message').textContent = code;
    document.getElementById('played-message').textContent = played;

    setTimeout(playMessage, 400);
}

function say() {
    if (isPlaying) {
        isPlaying = false;
    }
    else {
        var message = document.querySelector('#main input[type="text"]').value;
        morseCode = encode(message);
        document.getElementById('decoded-message').textContent = morseCode;
        document.getElementById('played-message').textContent = '';
        document.getElementById('say-button').textContent = 'Stop';
        isPlaying = true;
        playMessage();
    }
}

function stop() {
    document.getElementById('say-button').textContent = 'Say!';
    isPlaying = false;
}

// WebAudio functions:

var context = new AudioContext();

var dotSource, dashSource;
var destination;


function loadSoundFile(url, setSound) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(err) {
        context.decodeAudioData(this.response,
        setSound,
        function(err) {
            console.log('Error decoding file', err);
        });
    };
    xhr.send();
}

function setDotSound(decodedArrayBuffer) {
    dotSource = context.createBufferSource();
    dotSource.buffer = decodedArrayBuffer;
    dotSource.connect(context.destination);
}

function setDashSound(decodedArrayBuffer) {
    dashSource = context.createBufferSource();
    dashSource.buffer = decodedArrayBuffer;
    dashSource.connect(context.destination);
}

function playSound(dot_or_dash) {
    if (!isPlaying) {
        return;
    }
    else if (dot_or_dash === '.') {
        dotSource.start(0);
        setDotSound(dotSource.buffer);
    }
    else if (dot_or_dash === '-'){
        dashSource.start(0);
        setDashSound(dashSource.buffer);
    }
}

loadSoundFile('static/sounds/dog_dot.wav', setDotSound);
loadSoundFile('static/sounds/dog_dash.wav', setDashSound);