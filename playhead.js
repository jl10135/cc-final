let trackName = document.querySelector(".trackName");
let trackArtist = document.querySelector("trackArtist");

let playpauseButton = document.querySelector(".playpauseTrack");
let nextButton = document.querySelector(".nextTrack");
let prevButton = document.querySelector(".prevTrack");

let seekSlider = document.querySelector(".seekSlider");
let volumeSlider = document.querySelector(".volumeSlider")
let currentTime = document.querySelector(".currentTime");
let totalDuration = document.querySelector(".totalDuration");

let trackIndex = 0;
let isPlaying = false;
let updateTimer;
let loading = false;
// audio element
let currentTrack = document.createElement('audio');

// create tracklist array with all necessary info
let trackList = [
    {
        name: "starting line",
        artist: "luke hemmings",
        path: "media/01_starting_line.wav",
    },
    {
        name: "saigon",
        artist: "luke hemmings",
        path: "media/02_saigon.wav",
    },
    {
        name: "motion",
        artist: "luke hemmings",
        path: "media/03_motion.wav",
    },
    {
        name: "place in me",
        artist: "luke hemmings",
        path: "media/04_place_in_me.wav",
    },
    {
        name: "baby blue",
        artist: "luke hemmings",
        path: "media/05_baby_blue.wav",
    },
    {
        name: "repeat",
        artist: "luke hemmings",
        path: "media/06_repeat.wav",
    },
    {
        name: "mum",
        artist: "luke hemmings",
        path: "media/07_mum.wav",
    },
    {
        name: "slip away",
        artist: "luke hemmings",
        path: "media/08_slip_away.wav",
    },
    {
        name: "diamonds",
        artist: "luke hemmings",
        path: "media/09_diamonds.wav",
    },
    {
        name: "a beautiful dream",
        artist: "luke hemmings",
        path: "media/10_a_beautiful_dream.wav",
    },
    {
        name: "bloodline",
        artist: "luke hemmings",
        path: "media/11_bloodline.wav",
    },
    {
        name: "comedown",
        artist: "luke hemmings",
        path: "media/12_comedown.wav",
    },
];

trackName.textContent = trackList[trackIndex].name;

// buttons with html elements and positioning/status
function playTrack() {
    setInterval(seekUpdate, 1000);
    playpauseButton.innerHTML = '<i class = "fa fa-pause-circle fa-4x"></i>';
}

function pauseTrack() {
    playpauseButton.innerHTML = '<i class = "fa fa-play-circle fa-4x"></i>';
}

function nextTrack() {
    pauseTrack();
    song.stop();
    loading = true;
    trackIndex += 1;
    // maintaining proper tracklist positioning
    if(trackIndex == trackList.length){
        trackIndex = 0;
    }
    // load song given that "loading" is false, otherwise sketch will crash in between audios
    song = loadSound(trackList[trackIndex].path,function (){loading = false;
        trackName.textContent = trackList[trackIndex].name;
        
    }); 
    trackName.textContent = "loading...";
}

function prevTrack() {
    pauseTrack();
    song.stop();
    loading = true;
    trackIndex -= 1;
    if(trackIndex < 0){
        trackIndex = trackList.length - 1;
    }
        trackName.textContent = trackList[trackIndex].name;
    song = loadSound(trackList[trackIndex].path,function (){loading = false;
        trackName.textContent = trackList[trackIndex].name;
    });
    trackName.textContent = "loading...";
}

function seekTo() {
    console.log(seekSlider.value);
    song.jump(map(seekSlider.value,1,100,0,song.duration()));
}

function setVol() {
    console.log(volumeSlider.value);
    song.setVolume(map(volumeSlider.value,0,100,0,1));
}

function seekUpdate() {
    let seekPosition = map(song.currentTime(),0,song.duration(),1,100);
    if(seekPosition >= 99){
       seekPosition = 0;
       nextTrack();
    }

        seekSlider.value = seekPosition;

        // calculate time left & duration
        let currentMinutes = floor(song.currentTime()/60);
        let currentSeconds = floor(song.currentTime()-currentMinutes*60);
        let durationMinutes = floor(song.duration() / 60);
        let durationSeconds = floor(song.duration() - durationMinutes * 60);
        // adding zeroes so it's consistent
        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) {durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) {durationMinutes = "0" + durationMinutes; }

    currentTime.textContent = currentMinutes+":"+currentSeconds;
    totalDuration.textContent = durationMinutes+":"+durationSeconds;
}




