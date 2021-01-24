//mplayer 2.0

$(function(){

    var $Btn = $('#Btn');
    var $But = $('#but');
    var $stopBtn = $('#stopBtn');
    var $music = $('.music');
    var $chat = $('.chat');
    var audio = new Audio();
    var stream = 'http://212.109.193.106:8000/stream';
    var play = false;
    
    var startHandler = $Btn.ontouchstart;
    
    try {
        onSwipe(document.body, 'left', function(){
            $chat.animate ({
            marginLeft: '-100vw'
            }, 300 );
        });
    }
    catch (err) {
        console.log (err);
    }

    
    var i = 0;
    
    audio.canPlayType('audio/ogg');
    
    /*$Btn.on("touchstart", function(){
        Console.log("TOUCH");
    });*/

    $Btn.click(function()
    {
        console.log("Enter");
        i++;
        if (i % 2) {
            console.log(i);
            play = true;
            audio.src = stream;
            audio.canPlayType('audio/ogg; codecs="vorbis"');
            audio.play();
            console.log($Btn.src);
            $Btn.attr('src','images/stop_black_108x108.png');
            // $( selector ).animate( { properties }, duration, easing, complete ) 
            //Тестим чатик
            // $chat.animate({
            //     marginLeft: '0vh'
            // }, 600 );
        }
        else {
            play = false;
            audio.pause();
            $Btn.attr('src','images/play_arrow_black_108x108.png')
        };
    });
    
    // $chat.on( "swipe", swipeHandler );
    $But.click(function () {
          $chat.animate({
                marginLeft: '0vw'
            }, 400 );
    })

   

    document.onselectstart = function() { 
return false; 

}

    function swipeHandler( event ){
            console.log(event)
                $chat.animate({
                marginLeft: '-100vh'
            }, 500 );
    }

});


//onSwipe https://gist.github.com/1pxsun/d7dc446d79b84321d702
// example: onSwipe(document.body, 'left', function(){ alert('left') })
function onSwipe(el, dir, cb, w, x, y, z) {
    for (y in {touchstart: 0, touchmove: 0})
        el.addEventListener(y, function(ev) {
            w = ev.changedTouches[0];
            ev.type[5]=="m" && x
                && dir[0] == "l" == z > 0
                && Math.abs(x[0] - w.pageX) > 42
                && (x = 0 || cb());
            ev.type[5]=="s" && (x = [w.pageX, w.pageY]);
        });
}