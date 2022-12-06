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

// audio element
let currentTrack = document.createElement('audio');

// create tracklist
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


function loadTrack(trackIndex) {
    clearInterval (updateTimer);
    resetValues();

    // load track
    currentTrack.src = trackList[trackIndex].path;
    currentTrack.load();

    // update track name
    trackName.textContent = trackList[trackIndex].name;

    // update seek slider
    updateTimer = setInterval(seekUpdate, 1000);

    // track rotation
    currentTrack.addEventListener("ended", nextTrack)

    song.stop()
    songReload()
    song.play()
}

// resetting slider + time values
function resetValues() {
    currentTime.textContent = "00:00";
    totalDuration.textContent = "00:00";
    seekSlider.value = 0;
}

function playpauseTrack() {
    if (!isPlaying) playTrack();
    else pauseTrack();
}

function playTrack() {
    currentTrack.play();
    isPlaying = true;

    playpauseButton.innerHTML = '<i class = "fa fa-pause-circle fa-4x"></i>';
}

function pauseTrack() {
    currentTrack.pause();
    isPlaying = false;

    playpauseButton.innerHTML = '<i class = "fa fa-play-circle fa-4x"></i>';
}

function nextTrack() {
    if (trackIndex < trackList.length - 1)
        trackIndex += 1;
    else trackIndex = 0;
    loadTrack(trackIndex);
    playTrack();
}

function prevTrack() {
    if (trackIndex > 0)
        trackIndex -= 1;
    else trackIndex = trackList.length;
    loadTrack(trackIndex);
    playTrack();
}

function seekTo() {
    seekTo = currentTrack.duration * (seekSlider.value / 100);
    currentTrack.currentTime = seekTo;
}

function setVolume() {
    currentTrack.volume = volumeSlider.value / 100;
}

function seekUpdate() {
    let seekPosition = 0;

    if (!isNaN(currentTrack.duration)) {
        seekPosition = currentTrack.currentTime * (100 / currentTrack.duration);
        seekSlider.value = seekPosition;

        // calculate time left & duration
        let currentMinutes = Math.floor(currentTrack.currentTime / 60);
        let currentSeconds = Math.floor(currentTrack.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(currentTrack.duration / 60);
        let durationSeconds = Math.floor(currentTrack.duration - durationMinutes * 60);
        // adding zeroes so it's consistent
        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) {durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) {durationMinutes = "0" + durationMinutes; }
    }
}

// load track
loadTrack(trackIndex)



