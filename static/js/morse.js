/** 
 *  Text-to-MorseCode encoder
 *  MorseCode-to-Text decoder
 *  @class
 */
var MorseCodec = function() {
    /** All symbols available for encoding */
    this.ALPHABET = {
        // letters:
        'a': '.-',   'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.',
        'f': '..-.', 'g': '--.',  'h': '....', 'i': '..',  'j': '.---',
        'k': '-.-',  'l': '.-..', 'm': '--',   'n': '-.',  'o': '---',
        'p': '.--.', 'q': '--.-', 'r': '.-.',  's': '...', 't': '-',
        'u': '..-',  'v': '...-', 'w': '.--',  'x': '-..-','y': '-.--',
        'z': '--..',
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
    /** Number of time units between symbols */
    this.SHORT_GAP = 3;
    /** Number of time units between words */
    this.MEDIUM_GAP = 7;
};

/**
 * Encodes text to morse code discarding all spaces
 * @param {string} text - string to encode
 * @return {string} code - Morse code
 */
MorseCodec.prototype.encode = function(text) {
    var cleanText = text.trim().replace(/\s+/, '');
    return [].map.call(cleanText.toLowerCase(),
        function(s) {
            return this.ALPHABET[s];
        }, this)
       .join('');
}

/**
 * Encodes text to morse code 
 * with necessary amount of spaces for correct playback
 * @param {string} text - string to encode
 * @return {string} code - Morse code (with spaces)
 * @example
 *      'hi you' -> '. . . .   . .       - . - -    - - -   . . -'
 *      (3 spaces between symbols and 7 spaces between words)
 */
MorseCodec.prototype.encodeWithSpacing = function(text) {
    var wordGap = Array(this.MEDIUM_GAP + 1).join(' ');
    var symbolGap = Array(this.SHORT_GAP + 1).join(' ');

    var words = text.trim().replace(/\s+/, ' ').split(' ');

    var code = [];
    for (var i=0; i<words.length; i++) {
        code.push(
            [].map.call(words[i].toLowerCase(),
                function(s) {
                    return this.ALPHABET[s].split('').join(' ');
                }, this)
            .join(symbolGap)
        );
    }
    return code.join(wordGap);
}

/**
 * Decodes text from morse code
 * @param {string} code - Morse code to decode
 * @return {string} text - decoded string
 */
MorseCodec.prototype.decode = function(code) {
    return 'TODO: decoded';
}


/** 
 *  Player class based on Web Audio API functions
 *  @class    
 */
var MorseCodePlayer = function() {
    /** Time unit duration in milliseconds */
    this.DOT_DURATION = 75;
    this.DASH_DURATION = this.DOT_DURATION * 3;

    this.isPlaying = false;
};

MorseCodePlayer.prototype.loadSoundFile = function(url, setSound) {
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

MorseCodePlayer.prototype.createToneSignal = function(len) {
    var dashBuffer = context.createBuffer(1, len, context.sampleRate);
    var dashData = dashBuffer.getChannelData(0);
    for (var i = 0; i < len; i++) {
        dashData[i] = 20 * Math.sin(0.1 * i);
    }
    return dashBuffer;
}

MorseCodePlayer.prototype.loadSoundSet = function(setNo) {
    // just a plain sinusoid
    if (setNo === 0) {
        var len = this.DASH_DURATION * context.sampleRate / 1000;
        var dashBuffer = this.createToneSignal(len);
        this.setDashSound(dashBuffer);
        len = this.DOT_DURATION * context.sampleRate / 1000;
        var dotBuffer = this.createToneSignal(len);
        this.setDotSound(dotBuffer);
    }
    // cat
    else if (setNo === 1) {
        this.loadSoundFile('static/sounds/cat_dot.wav', this.setDotSound);
        this.loadSoundFile('static/sounds/cat_dash.wav', this.setDashSound);
    }
    // dog
    else if (setNo === 2) {
        this.loadSoundFile('static/sounds/dog_dot.wav', this.setDotSound);
        this.loadSoundFile('static/sounds/dog_dash.wav', this.setDashSound);
    }
}

MorseCodePlayer.prototype.setDotSound = function(decodedArrayBuffer) {
    dotSource = context.createBufferSource();
    dotSource.buffer = decodedArrayBuffer;
    dotSource.connect(context.destination);
}

MorseCodePlayer.prototype.setDashSound = function(decodedArrayBuffer) {
    dashSource = context.createBufferSource();
    dashSource.buffer = decodedArrayBuffer;
    dashSource.connect(context.destination);
}

MorseCodePlayer.prototype.playText = function(text, update) {
    this.isPlaying = true;
    this.playSymbol(text, update);
}

MorseCodePlayer.prototype.playSymbol = function(text, update) {
    if (text.length === 0 || !this.isPlaying) {
        this.stop();
        return;
    }
    pause = this.DOT_DURATION;
    if (text[0] === '.') {
        dotSource.start(0);
        this.setDotSound(dotSource.buffer);
        update();
    }
    else if (text[0] === '-'){
        dashSource.start(0);
        this.setDashSound(dashSource.buffer);
        pause = this.DASH_DURATION;
        update();
    }
    setTimeout(function(self) {
                  self.playSymbol(text.slice(1), update);
               },
               pause, this);
}

MorseCodePlayer.prototype.stop = function() {
    this.isPlaying = false;
}

var context = new AudioContext();
var dotSource, dashSource;
