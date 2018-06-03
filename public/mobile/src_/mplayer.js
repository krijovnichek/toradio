$(function(){

    var $playBtn = $('#playBtn');
    var $stopBtn = $('#stopBtn');
    var audio = new Audio();
    var stream = 'http://46.17.43.79:8000/stream';
    
    
    
    
    
    $playBtn.click(function(){
        //audio.load('http://localhost:8000/live');
        audio.src = stream;
        audio.play();
        $playBtn.css('display', 'none');
        $stopBtn.css('display', 'block');
    })

    $stopBtn.click(function(){
        audio.pause();
        $stopBtn.css('display', 'none');
        $playBtn.css('display', 'block');
    })

});