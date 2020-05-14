// CLIENT 2.0
function check ( )
{   

    // console.log(x);  
        window.location.href = "https://www.google.com";
        // console
    
}


$(function(){
    const socket = io.connect();
    const $input = $('#input');
    const $newMessage = $('#newMessage');
    const $messages = $('#messages');
    const $userName = $('#userName');
    const $userNameInput = $('#userNameInput');
    const $newUN = $('#newUserName');
    const $artist = $('#artist');
    const $title = $('#title');
    let $cover = $('#cover');
    let cover = new Image();
    let time;
    let i = false;
    let isAdv = false;


    getCover();

    
    $("#newMessage").keyup(function(event)
    {
        if(event.keyCode === 13)
            {
                event.preventDefault();
                if($newMessage.val().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"))
                    {
                    socket.emit('send message',
                        {
                            text: $newMessage.val().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                            user: $newUN.val().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                        });
                    $newMessage.val('');
                    }
                else {
                }

            }
    });

    $input.submit(function(e){

        e.preventDefault();
        if ($newMessage.val().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"))
            {
                socket.emit('send message',
                {
                    text: $newMessage.val().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                    user: $newUN.val().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                });
            $newMessage.val('');
            }
        else
            {
            console.log('Что-то пошло не так в send message');
            }
    });




    $userNameInput.submit(function(e){
        e.preventDefault();
            if ( $newUN.val().replace(/\s/ig, '')){ // проверка на пустоту
                $userNameInput.hide();
                $input.show();
                }

    // Вставмяем имя в текст плейсхолдера сообщения
    $('#newMessage').attr("placeholder", $newUN.val() + ", напишите что-нибудь");

    });

    // Выводим сообщение в чат
    socket.on('new message', function(data) {

        $messages.append('<div class="message"><img src="/images/upic100_'+getRandomInt(1, 7)+'.png" width="50" height="50" alt=""><p><name>'+data.user+':</name><br>'+data.msg+'</p></div>');
        autoscroll();

    });

    socket.on('loadOldMessages', function(docs){
        for (let i=docs.length-1; i>=0; i--)
            {
                $messages.append('<div class="message hyphenate"><img src="/images/upic100_'+getRandomInt(1, 7)+'.png" width="50" height="50"><p><name>'+docs[i].user+':</name><br>'+docs[i].msg+'</p></div>');
                autoscroll();
            }

    });

    //Обновление информации о песнях
    socket.on('infoUpdate', function(songInfo){

        if (i === false) {
            time = 0;
        }
        else {
            time = 6000;
        }
        setTimeout(function(){
            $artist.text(songInfo.artist);
            if (songInfo.artist === 'Реклама') {
                isAdv=true;
            }
            else { isAdv=false }
            $title.text(songInfo.title);

            if (isAdv) {
                $cover.attr('src', 'images/default.png');
                $.ajax({
                url: 'images/default.png',
                });
            }
            else $cover.attr('src',songInfo.coverUrl);

            if (songInfo.coverUrl !== 'nothing') {
                    $.ajax({
                    url: songInfo.coverUrl,
                    });
            }
            else {
                if (isAdv) {
                    $.ajax({
                    url: 'images/default.png',
                    });
                }
                else {
                $.ajax({
                    url: "images/artwork.png",
                    });
                $cover.attr('src','images/artwork.png');
                }
            }
            i = true;
        }, time)


    });




            
             //автоскролл на дно
            function autoscroll(){
                document.getElementById('messages').scrollTop=5550;
            };

            function getInfo(){
                $(document).get('/getInfo', function(data) {
                });   
            };  

            function getCover(){
                cover.src = 'images/artwork.png';
                $cover.attr('src', 'images/artwork.png');
                cover.onload = function(){

                    if (isAdv) {
                        $cover.attr('src', 'images/default.png');
                    }
                    $cover.attr('src', 'images/artwork.png');
                };
                cover.onerror = function(){
                    $cover.attr('src', 'images/default.png');
                };
            
            };



            function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
}

            
       
});