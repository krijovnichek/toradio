// CLIENT 2.0


$(function(){
    const socket = io.connect();
    const $artist = $('#artist');
    const $title = $('#title');
    let $cover = $('#cover');
    let cover = new Image();
    const $input = $('#input');
    const $newMessage = $('#newMessage');
    const $messages = $('#messages');
    const $userName = $('#userName');
    const $userNameInput = $('#userNameInput');
    const $newUN = $('#newUserName');
    let time;
    let i = false;
    let isAdv = false;


    getCover();
    socket.on('infoUpdate', function (songInfo) {

        if (i === false) {
            time = 0;
        } else {
            time = 6000;
        }
        setTimeout(function () {
            $artist.text(songInfo.artist);
            if (songInfo.artist === 'Реклама') {
                isAdv = true;
            } else {
                isAdv = false
            }
            $title.text(songInfo.title);

            if (isAdv) {
                $cover.attr('src', 'images/default.png');
                $.ajax({
                    url: 'images/default.png',
                });
            } else $cover.attr('src', songInfo.coverUrl);

            if (songInfo.coverUrl !== 'nothing') {
                $.ajax({
                    url: songInfo.coverUrl,
                });
            } else {
                if (isAdv) {
                    $.ajax({
                        url: 'images/default.png',
                    });
                } else {
                    $.ajax({
                        url: "images/artwork.png",
                    });
                    $cover.attr('src', 'images/artwork.png');
                }
            }
            i = true;
        }, time)


    });


    $("#newMessage").keyup(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if ($newMessage.val().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")) {
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
        console.log(data.upicURL);
        console.log(data.user);

        $messages.append('<div class="message"><img src=' + data.upicURL + ' width="50" height="50" alt=""><p><name>' + data.user + ':</name><br>' + data.msg + '</p></div>');
        autoscroll();

    });

    socket.on('loadOldMessages', function(docs){
        for (let i=docs.length-1; i>=0; i--) {
            // console.log(docs[i].upicURL);
            $messages.append('<div class="message hyphenate"><img src=' + docs[i].upicURL + ' width="50" height="50"><p><name>' + docs[i].user + ':</name><br>' + docs[i].msg + '</p></div>');
            autoscroll();
        }

    });

    //Обновление информации о песнях

            
             //автоскролл на дно
            function autoscroll(){
                document.getElementById('messages').scrollTop=5550;
            }

            function getInfo(){
                $(document).get('/getInfo', function(data) {
                });
            }

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

            }



            function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
}

            
       
});