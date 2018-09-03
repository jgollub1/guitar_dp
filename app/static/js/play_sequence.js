
// alert('hey you man');
// var myGeocode = ['{{ sequence[0] }}', '{{ sequence[1] }}'];
// alert({{sequence|safe}});
// alert({{Object.keys(sequence)}});
// alert({{sequence[1]}});
// // test out the sequence player
// playNotes({{ notes|safe }});

// // midi player
// var MidiPlayer = require('midi-player-js');
// // mp3 player
// var player = require('play-sound')(opts = {})

// var audioPlayer; //audio player
// var midiParser = createMidiParser(); //midi parser
// midiParser.on('fileLoaded', loadedSong);


// Initialize player and register event handler
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

//default options
var config = {
    port: 8080,
    colorOrder: 'RGB',
    startPixel: 0,
    audioPath: '',
    cron: '0 * */1 * * *',
    delayBetweenSongs: 5000,
    offColor: 'pink',
    pitchSort: 'ascending',
    minVelocity: 50, //ensures quiet notes still bright enough to illuminate pixel
    midiDelayX86: 100,
    midiDelayARM: 350
};

//override default options with config file
// config = Object.assign(config, require('./config.js'));

//validate config file
//has songs
// if(config.songs.length < 1){
//     console.log('!!! Error !!!, no songs defined in config.js, config.songs is empty.');
//     process.exit(0);
// }

//midi parser
var MidiPlayer = require('midi-player-js');
//mp3 player
var player = require('play-sound')(opts = {})

var FILE_PATH = '../../../cheryl.mid'
var audioPlayer; 
var midiParser = createMidiParser();

loadSong(); //start loading each song, last to first and store track scale analyses
midiParser.play();

// Initialize player and register event handler
function createMidiParser(){
    var newMidiParser = new MidiPlayer.Player(); 
    newMidiParser.on('Note on', () => {
    	// increment counter and light up note

    });
    newMidiParser.on('Note off', () => {
    	// unlight the note

    });
    midiParser.on('fileLoaded', loadedSong);
	midiParser.on('endOfFile', (event) => {
		console.log('end of file')
	});
    return newMidiParser;
}

function loadSong(){
    midiParser.loadFile(FILE_PATH);
}

// there should be play functions for audio and midi players
function play(){    
    player.play(config.audioPath+config.songs[currentSong].audioFile, { omxplayer: ['-o', 'alsa', '--vol', volume ]}, function(err){
    });
}

function stop(){
    midiParser.stop();
}

// function playbackReady(){
//     isPlaybackReady = true;
// }

// function disableSchedulePlay(){
//     schedulePlay = false;
//     playMidiTimeout && clearTimeout(playMidiTimeout);
//     nextSongTimeout && clearTimeout(nextSongTimeout);
// }







// function createMidiParser(){
//     return new MidiPlayer.Player(function(event) {
//         if(event.name == "Note on"){

//         }
//         else if (event.name == "Note off" ){

//         }
//     });
// }

// function setupComplete(){
//     console.log('Setup Complete');
//     //web socket events
//     io.on('connection', function (socket) {
    
//         console.log('Client Connected');
//         var interval = parser.parseExpression(config.cron);
//         config.nextRuntime = new Date(interval.next());
        
//         if(midiParser.isPlaying()){
//             config.currentSong = currentSong;
//         }
        
//         socket.emit('config', config);
//         socket.on('play', play);
//         socket.on('stop', stop);
//         socket.on('playSong', playSong);
//         socket.on('disableSchedulePlay', disableSchedulePlay);
//     });
// }

// function playSong(index){
    
//     console.log('playSong('+index+')', new Date().toLocaleTimeString());
    
//     if(currentSong != index){
//         //new song, change song and play
//         stop();
//         console.log('set currentSong to', index);
//         currentSong = index;
//         isPlaybackReady = false;
//         loadSong();
//     }else{
//         //same song, restart
//         stop();
//         play();
//     }
// }

// function play(){    
//     playMidiTimeout = setTimeout(function(){
//         config.songs[currentSong].midiStartAt && midiParser.skipToSeconds(config.songs[currentSong].midiStartAt);
//         if(typeof config.songs[currentSong].midiTempo != 'undefined'){
//             midiParser.tempo = config.songs[currentSong].midiTempo;
//         }
//         try{
//             midiParser.play();
//         }catch(e){
//             console.log('ERROR Unable to play midi '+ config.songs[currentSong]+', already playing.', new Date().toLocaleTimeString());
//         }
//         playMidiWaiting = false;
        
//         //reenable schedule play and notify front end
//         schedulePlay = true;
//         var interval = parser.parseExpression(config.cron);
//     }, delay);
//     playMidiWaiting = true;
    
    
//     //range from 0 to -6000 millibels
//     var omxVolumeScale = d3.scaleLinear().range([-6000, 0]).clamp(true);
//     var volume = omxVolumeScale(1);
//     if(!isNaN(config.songs[currentSong].volume)){
//         volume = omxVolumeScale(config.songs[currentSong].volume);
//     }
    
//     audioPlayer = player.play(config.audioPath+config.songs[currentSong].audioFile, { omxplayer: ['-o', 'alsa', '--vol', volume ]}, function(err){
//       //if (err && !err.killed) throw err
//     });
    
//     console.log('Play audio', config.songs[currentSong].audioFile, new Date().toLocaleTimeString());
//     io.emit('play', currentSong);
//     config.songs[currentSong].playing = true; 
    
//     //set pixels
//     setPixels(config.startPixel, config.startPixel+config.numPixels, config.songs[currentSong].offColor);
// }

// function loadedSong(midiParser){
//     //analyze midi tracks, recursively load next song in reverse order so first song is ready to play
//     if(!analyzedMidis){
//         config.songs[currentSong].duration = midiParser.getSongTime();
//         console.log('Analyze song', currentSong, config.songs[currentSong].midiFile, Math.round(config.songs[currentSong].duration)+' seconds');        
//         analyzeMidi(midiParser, currentSong);
//         if(currentSong > 0){
//             //analyze the rest of the songs
//             loadSong(--currentSong);
//         } else {
//             analyzedMidis = true;
//             setupComplete();
//             playbackReady();
//         }
//     } else {
//         console.log('Loaded song', currentSong, config.songs[currentSong].midiFile, Math.round(midiParser.getSongTime())+' seconds', new Date().toLocaleTimeString());
//         playbackReady();
//         play();
//     }
// }
