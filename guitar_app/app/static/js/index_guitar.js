var slideSpeed = 300;
var noteToShow = "All";
var canClick = true;

// alert('starting...');
var notes = {
	E: ['1.0','1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8','1.9','1.10','1.11','1.12'],
	a: ['2.0', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '2.10', '2.11', '2.12'],
	d: ['3.0', '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11', '3.12'],
	g: ['4.0', '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '4.10', '4.11', '4.12'],
	b: ['5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9', '5.10', '5.11', '5.12'],
	e: ['6.0', '6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7', '6.8', '6.9', '6.10', '6.11', '6.12'],
}

for (var i=0; i < notes.e.length; i++){
	$('.mask.low-e ul').append('<li note='+notes.E[i]+'></li>')
	$('.mask.a ul').append('<li note='+notes.a[i]+'></li>')
	$('.mask.d ul').append('<li note='+notes.d[i]+'></li>')
	$('.mask.g ul').append('<li note='+notes.g[i]+'></li>')
	$('.mask.b ul').append('<li note='+notes.b[i]+'></li>')
	$('.mask.high-e ul').append('<li note='+notes.e[i]+'></li>')
}

// var MidiPlayer = require('midi-player-js');
// // Initialize player and register event handler
// var Player = new MidiPlayer.Player(function(event) {
// 	console.log(event);
// });

// Player.on('midiEvent', function(event) {
// 	alert('event...');
//     // Do something when a MIDI event is fired.
//     // (this is the same as passing a function to MidiPlayer.Player() when instantiating.
// });

// // Load a MIDI file
// Player.loadFile('cheryl.mid');
// Player.play();

$('.controls a.down').click(function(){
	if(!canClick){return false;}
	canClick = false;

	$('.mask').each(function(){
		var el = $(this);
		var nextNote = el.find('li:nth-child(12)').text();

		el.animate({right: -268}, slideSpeed);
		setTimeout(function(){
			el.find('ul').prepend( "<li note="+nextNote+">"+nextNote+"</li>" );
			el.find('li:last-child').remove();
			el.css({right: -189});
		}, slideSpeed+20)
	});

	setTimeout(function(){
		changeOpenNotes();
		showNotes(noteToShow);
		canClick = true;
	}, slideSpeed+20)
	
	return false;
});

$('.controls a.up').click(function(){
	if(!canClick){return false;}
	canClick = false;

	$('.mask').each(function(){
		var el = $(this);
		var nextNote = el.find('li:nth-child(2)').text();

		$( "<li note="+nextNote+">"+nextNote+"</li>" ).appendTo(el.find('ul'));
		el.css({right: -268});
		el.find('li:first-child').remove();
		el.animate({right: -189}, slideSpeed);
		
	});

	changeOpenNotes();
	showNotes(noteToShow);

	setTimeout(function(){
		canClick = true;
	}, slideSpeed+20)
	return false;
});

$('.controls li').click(function(){
	noteToShow = $(this).text();
	showNotes(noteToShow);
});

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function stateChange(newState) {
    setTimeout(function () {
        if (newState == -1) {
            alert('VIDEO HAS STOPPED');
        }
    }, 5000);
}

// function playNotes(sequence){
// 	// alert(sequence.length);
// 	for (var i=0; i < sequence.length; i++){
// 		$('.guitar-neck .notes li').not('[note="'+sequence[i]+'"]').animate({opacity:0}, 500);
// 		$('.guitar-neck .notes li[note="'+sequence[i]+'"]').animate({opacity:1}, 500);
// 		// alert('before')
// 		// alert(sequence[i])
// 		// await sleep(1000);
// 		// setTimeout(playNotes, 5000);
// 		// stateChange(1);
		
// 		// alert('after')
// 		// $('.guitar-neck .notes li[note="'+sequence[i]+'"]').animate({opacity:0}, 500);
// 		// showNotes(sequence[i]);		
// 		// await sleep(1000);
// 	}
// }

// alert('hey you man')
// var myGeocode = ['{{ sequence[0] }}', '{{ sequence[1] }}']
// alert({{sequence}} | safe)
// alert({{Object.keys(sequence)}})
// alert({{sequence[1]}})
// test out the sequence player
// playNotes({{ notes|safe }})


