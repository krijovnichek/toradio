// PLAYER 2.0


$(function(){

    var $Btn = $('#Btn');
    var audio = new Audio();
    var stream = 'http://194.67.113.125:8000/stream';
       
    
    var play = false;
   
    
    var i = 0;
    
    
        $Btn.click(function()
    {
        i++;
        if (i % 2) {
            play = true;
            audio.src = stream;
            audio.play();
            $Btn.attr('src','images/stop.png');

        }
        else {
            play = false;
            audio.pause();
            $Btn.attr('src','images/play.png')
        };
    });
    

});