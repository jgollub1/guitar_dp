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
		$('.guitar-neck .notes li').animate({opacity:1}, 500);
	} else {
		$('.guitar-neck .notes li').not('[note="'+noteToShow+'"]').animate({opacity:0}, 500);
		$('.guitar-neck .notes li[note="'+noteToShow+'"]').animate({opacity:1}, 500);	
	}
}

function changeOpenNotes(){
	$('.notes .mask').each(function(){
		var el = $(this);
		var elClass = el.attr('class').split(' ')[1];
		var note = el.find('li:last-child').text();

		$('.open-notes .'+elClass).text(note);
	});
}

var changeTempo = function(tempo) {
	Player.tempo = tempo;
}

var play = function() {
	$('.guitar-neck .notes li').not('[note="'+sequence[globalIndex]+'"]').animate({opacity:0}, 500); // clear the fretboard
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

var buildTracksHtml = function() {
	Player.tracks.forEach(function(item, index) {
		var trackDiv = document.createElement('div');
		trackDiv.id = 'track-' + (index+1);
		var h5 = document.createElement('h5');
		h5.innerHTML = 'Track ' + (index+1);
		var code = document.createElement('code');
		trackDiv.appendChild(h5);
		trackDiv.appendChild(code);
		eventsDiv.appendChild(trackDiv);
	});
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

					// use velocity-js instead of jquery
					$('.guitar-neck .notes li[note="'+sequence[currentIndex]+'"]')
						.velocity({
							properties: { opacity: 1 },
							options: { duration: 20, easing: "easeInSine" },
						})
						.velocity({
							properties: { opacity: 0 },
							options: { duration: 300, easing: "easeInSine" },
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
			const isNoteOn = (midiEvent) => midiEvent.name === "Note on";
			const getNote = (midiEvent) => midiEvent.noteNumber; 
			const notePath = midiEvents.filter(isNoteOn).map(getNote);
			$.ajax({
				url: '/read_file',
				data: JSON.stringify(notePath),
				contentType: 'application/json;charset=UTF-8',
				type: 'POST',
				success: (data) => {
					console.log('here is data...', data);
					sequence = data.split(',');
					console.log('succeeded sending ajax');
				},
				error: () => {
					console.log('failed sending ajax')
				},
			});
			console.log('PARSED THIS ONE', notePath);
		}, false);
	}

	loadDataUri = function(dataUri) {
		Player = new MidiPlayer.Player(function(event) {
			if (event.name == 'Note on' && event.velocity > 0) {
				instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
				//document.querySelector('#track-' + event.track + ' code').innerHTML = JSON.stringify(event);
				//console.log(event);
			}

			document.getElementById('tempo-display').innerHTML = Player.tempo;
			document.getElementById('file-format-display').innerHTML = Player.format;	
			document.getElementById('play-bar').style.width = 100 - Player.getSongPercentRemaining() + '%';
		});

		Player.loadDataUri(dataUri);

		document.getElementById('play-button').removeAttribute('disabled');

		play();
	}
	// loadDataUri(mario);
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


var mario = 'data:audio/midi;base64,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QgAAOQAPOWQAQmQtQgAAOQBLJmQtJgAPOWQAQmQtQgAAOQAPOWQAQmQtQgAAOQBLK2QtKwAPQ2QAO2QtOwAAQwAPQ2QAO2QtOwAAQwBLT1AAK2QtKwAPQ2QAO2QtOwAAQwAPO2QAQ2QtQwAAOwBLTwAATVAAL2QtLwAPQWQAR2QtRwAAQQAPQWQAR2QtRwAAQQBLTQAATFAAMGQtMAAPQGQASGQtSAAAQAAPQGQASGQtSAAAQABLTAAAMWQAS1AtMQAPP2QASWQtSQAAPwAPP2QASWQtSQAAPwBLSwAAMmQASlAtMgAPQmQARWQtRQAAQgAPQmQARWQtRQAAQgBLSgAAKmQASFAtKgAPPmQAQmQtQgAAPgAPPmQAQmQtQgAAPgBLSAAAL2QAN2QAR1AtNwAALwBLK2QAL2QtLwAAKwBLRwAAL2QAN2QtNwAALwBLSmRaSgAASGQeSAAAN2QAK2QAR2Q8NwAAO2Q8OwAARwAAPmQASmQ8PgAAO2Q8OwAASgAAKwAAN2QAL2QAT2Q8NwAAO2Q8OwAAPmQ8PgAATwAATmQAO2Q8OwAATgAALwAAPGQAMGQAS2Q8PAAAQGQ8QAAASwAAQ2QATGQ8QwAAQGQ8QAAATAAAMAAAMWQAPWQAUWQ8PQAAQGQ8QAAAQ2Q8QwAAUQAAT2QAQGQ8QAAATwAAMQAAPmQAMmQ8PgAAQmQ8QgAARWQ8RQAAQmQ8QgAAMgAAPmQALWQ8PgAAQmQ8QgAARWQ8RQAAQmQ8QgAALQAAN2QAL2Q8NwAAO2Q8OwAAPmQ8PgAAO2Q8OwAALwAAN2QAK2Q8NwAAO2Q8OwAASmQAPmQ8PgAAO2QeSgAASGQeSAAAOwAAKwAAN2QAK2QAR2Q8NwAAO2Q8OwAARwAAPmQASmQ8PgAAO2Q8OwAASgAAKwAAN2QAL2QAT2Q8NwAAO2Q8OwAAPmQ8PgAATwAATmQAO2Q8OwAATgAALwAAPGQAMGQAS2Q8PAAAQGQ8QAAASwAAQ2QATGQ8QwAAQGQ8QAAATAAAMAAAMWQAPWQAUWQ8PQAAQGQ8QAAAQ2Q8QwAAUQAAQGQAT2Q8TwAAQAAAMQAAPmQAMmQ8PgAAQmQ8QgAARWQ8RQAAQmQ8QgAAMgAAOWQAKmQ8OQAAPmQ8PgAAQmQ8QgAAPmQ8PgAAKgAAO2QAK2Q8OwAAPmQ8PgAAOWQ8OQAAPmQ8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';
