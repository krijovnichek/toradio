// PLAYER 2.0
const Btn = document.getElementById('playBtn');
let audio = new Audio();
let stream = "http://194.67.113.125:8000/stream";



function ready () {

}

document.addEventListener("DOMContentLoaded", ready);

function audioStop() {
    audio.pause();
    Btn.setAttribute("src", "images/play.png");
    Btn.setAttribute("id", "playBtn");
    Btn.setAttribute("onclick", "playClick()");
}

function playClick() {
    audio.src = stream;
    Btn.setAttribute("src", "images/stop.png");
    // Логика плеера
    let playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(function() {
            Btn.setAttribute("id", "pauseBtn");
            Btn.setAttribute("onclick", "audioStop()");
        })
            .catch(function (error)  {

            });
    }
}
    

