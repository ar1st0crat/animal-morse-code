# Animals speaking Morse code

Try it: https://ar1st0crat.github.io/animal-morse-code

There are two classes in ```morse.js```:
* MorseCodec
* MorseCodePlayer

The **MorseCodec** class allows Morse encoding and decoding text messages.
The simplest encoding is done via ```encode``` method:

```JavaScript
var morse = new MorseCodec();

var code = morse.encode('hi you');
console.log(code);

// prints:
// ......-.-----..-
```

This Morse code is OK for printing, however it's impossible to unambiguously decode it, since it does not contain word or symbol delimiters. That's why the class provides also a convenient method ```encodeWithSpacing``` that preserves and encodes all necessary text information. The resulting code is used by **MorseCodePlayer** class because it can be treated as the precise instruction for how to play the code (i.e. the distance between symbols should be equal to 3 time units and the distance between words - 7 time units). The time units are encoded as whitespaces but we can post-process the code anyway we need. Another good news is that we can also decode it via ```decode``` method:

```JavaScript
var code = morse.encodeWithSpacing('hi you');
console.log(code);

// prints:
// . . . .   . .       - . - -   - - -   . . -

var message = morse.decode(code);
console.log(message);

// prints:
// hi you
```


The **MorseCodePlayer** class allows playing Morse codes using different sounds for dots and dashes. First, we might want to load the desired sounds (like animal sounds in our example). To do this we should call ```loadSoundSet``` method and specify index of the soundset in the list of available sets. Next, the ```playText``` method is called. The first parameter of this method is the message whose Morse code we would like to hear. The second parameter is a callback function that should be called each time after dot or dash was played.

```JavaScript
var player = new MorseCodePlayer();
player.loadSoundSet(1);
player.playText('hi you', callback);
```

Sets are defined in variable ```SOUND_FILES```:

```JavaScript
player.SOUND_FILES = 
  [['static/sounds/cat_dot.wav', 'static/sounds/cat_dash.wav'],     // set #1
   ['static/sounds/dog_dot.wav', 'static/sounds/dog_dash.wav']];    // set #2
    // ...you can add sounds by other animals to this array...
```

By default no sounds are loaded, but dots and dashes are generated programmatically as the sinusoidal tones of different length (set #0). It is equivalent to calling:

```JavaScript
player.loadSoundSet(0);
```

We can change the frequency and duration of sounds:

```JavaScript
player.TONE = 440
player.DOT_DURATION = 120
```

Note that the duration of a dash will always be calculated automatically as ```3 * DOT_DURATION```.

If you need to stop playback just call:

```JavaScript
player.stop();
```


![pic1](https://github.com/ar1st0crat/animal-morse-code/blob/master/static/images/screenshot.png)