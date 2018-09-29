// var MidiPlayer = MidiPlayer;
// var player = require('play-sound')(opts = {})
var slideSpeed = 300;
var noteToShow = "All";
var canClick = true;
var globalIndex = 0;
var FILE_PATH = '../../../cheryl.mid'

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



