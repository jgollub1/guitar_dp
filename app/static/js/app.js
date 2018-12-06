var MidiPlayer = MidiPlayer;
var loadFile, loadDataUri, Player;
var AudioContext = window.AudioContext || window.webkitAudioContext || false; 
var ac = new AudioContext || new webkitAudioContext;
var eventsDiv = document.getElementById('events');
var noteToShow = "All";
const instrumentUrl = 'https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/MusyngKite/acoustic_guitar_nylon-mp3.js'

var notes = {
	E: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '1.10', '1.11', '1.12'],
	a: ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '2.10', '2.11', '2.12'],
	d: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11', '3.12'],
	g: ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '4.10', '4.11', '4.12'],
	b: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9', '5.10', '5.11', '5.12'],
	e: ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7', '6.8', '6.9', '6.10', '6.11', '6.12'],
}

for (var i=0; i < notes.e.length; i++){
	$('.mask.low-e ul').append('<li note='+notes.E[i]+'></li>')
	$('.mask.a ul').append('<li note='+notes.a[i]+'></li>')
	$('.mask.d ul').append('<li note='+notes.d[i]+'></li>')
	$('.mask.g ul').append('<li note='+notes.g[i]+'></li>')
	$('.mask.b ul').append('<li note='+notes.b[i]+'></li>')
	$('.mask.high-e ul').append('<li note='+notes.e[i]+'></li>')
}

function showNotes(noteToShow){
	if(noteToShow == "All"){
		$('.guitar-neck .notes li').velocity({
			properties: { opacity: 1 },
			options: { duration: 20 },
		});
	} else {
		$('.guitar-neck .notes li').not('[note="'+noteToShow+'"]').velocity({
			properties: { opacity: 0 },
			options: { duration: 20 },
		});
		$('.guitar-neck .notes li[note="'+noteToShow+'"]').velocity({
			properties: { opacity: 1 },
			options: { duration: 20 },
		});	
	}
}

var changeTempo = function(tempo) {
	Player.tempo = tempo;
}

var play = function() {
	showNotes(sequence[globalIndex]);
	Player.play();
	document.getElementById('play-button').innerHTML = 'Pause';
}

var pause = function() {
	Player.pause();
	document.getElementById('play-button').innerHTML = 'Play';
}

var stop = function() {
	Player.stop();
	document.getElementById('play-button').innerHTML = 'Play';
}

Soundfont.instrument(ac, instrumentUrl).then(function (instrument) {
	document.getElementById('loading').style.display = 'none';
	document.getElementById('select-file').style.display = 'block';

	loadFile = function() {
		globalIndex = 0;
		var file    = document.querySelector('input[type=file]').files[0];
		var reader  = new FileReader();
		var currentIndex;
		if (file) reader.readAsArrayBuffer(file);
		eventsDiv.innerHTML = '';

		reader.addEventListener("load", function () {
			Player = new MidiPlayer.Player(function(event) {
				if (event.name == 'Note on') {
					currentIndex = globalIndex;
					globalIndex++;
					instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});

					// uses velocity-js instead of jquery
					$('.guitar-neck .notes li[note="'+sequence[currentIndex]+'"]')
						.velocity({
							properties: { opacity: 1 },
							options: { duration: 20, easing: "easeInSine" },
						})
						.velocity({
							properties: { opacity: 0 },
							options: { duration: 250, easing: "easeInSine" },
						});

				}
				document.getElementById('tempo-display').innerHTML = Player.tempo;
				document.getElementById('file-format-display').innerHTML = Player.format;
				document.getElementById('play-bar').style.width = 100 - Player.getSongPercentRemaining() + '%';
			});

			Player.loadArrayBuffer(reader.result);
			document.getElementById('play-button').removeAttribute('disabled');


			// NOTE: access events AFTER you've actually loaded the array buffer...
			// console.log() in browser is not actually representative of the object's 
			// state at the time of the call, which is confusing

			const midiEvents = Player.events[0];
			const isNoteOn = midiEvent => midiEvent.name === "Note on";
			const getNote = midiEvent => midiEvent.noteNumber; 
			const notePath = midiEvents.filter(isNoteOn).map(getNote);
			$.ajax({
				url: '/read_file',
				data: JSON.stringify(notePath),
				contentType: 'application/json;charset=UTF-8',
				type: 'POST',
				success: (data) => {
					sequence = data.split(',');
					console.log('succeeded sending ajax sequence: ', sequence);
				},
				error: () => {
					console.log('failed sending ajax')
				},
			});
			play();
		}, false);
	}
});

var codemirror = CodeMirror.fromTextArea(
    document.getElementById("code-block"), 
    {
        lineNumbers     : true,
        lineWrapping    : true,
        mode            : "xml",
        mode: "python",
        htmlMode        : true,
        theme           : "twilight",
        // theme			: "monokai",
        //     autoCloseBrackets: true,
		//     matchBrackets: true,
		// showCursorWhenSelecting: true,
		//     keyMap: "sublime",
        tabSize         : 2,
        indentUnit      : 2,
});

var value = "'''\nImplement the cost function\n'''\n";
value += "def compute_cost(tup1, tup2):\n";
value += "\tstring1, fret1, finger1 = tup1\n";
value += "\tstring2, fret2, finger2 = tup2\n";
value += "\texpected_fret = fret1 + (finger2 - finger1)\n";
value += "\treturn (fret2 - expected_fret)**2\n";
codemirror.setValue(value);
