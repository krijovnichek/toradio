// PLAYER 2.0
let play = false;
const Btn = document.getElementById('playBtn');
let audio = new Audio();
let stream = "http://localhost:8000/stream";



function ready () {
    console.log('ready');
}

document.addEventListener("DOMContentLoaded", ready);

function audioStop() {
    console.log("audio stop");
    audio.pause();
    Btn.setAttribute("src", "images/play.png");
    Btn.setAttribute("id", "playBtn");
    Btn.setAttribute("onclick", "playClick()");
}

function playClick() {
    audio.src = stream;
// Логика плеера
    let playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(function() {
            Btn.setAttribute("src", "images/stop.png");
            Btn.setAttribute("id", "pauseBtn");
            Btn.setAttribute("onclick", "audioStop()");
        })
            .catch(function (error)  {

            });
    }
}
    

