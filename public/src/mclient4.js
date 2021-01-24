//MCLIENT 2.0

$(function () {


    const config = {
        "host": "http://212.109.193.106",
        "port": 3000,
        "mobile_host": "http://212.109.193.106",
        "mobile_port": 3001,
        "r_host": "localhost",
        "r_port": 8000,
        "mount": "/stream"
      }

    const host = config.host;
    const port = config.mobile_port;
    let socket = io(host+port, {'transports': ['websocket', 'polling']});
    socket = io.connect();
    const $input = $('#input');
    const $sendbtn = $('#sendbtn');

    const $newMessage = $('#newMessage');

    const $messages = $('#messages');
    const $userName = $('#userName');
    const $userNameInput = $('#userNameInput');
    const $newUN = $('#newUserName');
    const $artist = $('#artist');
    const $title = $('#title');
    const $cover = $('#cover');
    const cover = new Image();
    let i = false;
    let time;
    const $mainid = $('#mainid');


    try {
        getCover();
    } catch (err) {
        console.log(err + " Get cover попытка");
    }

    $input.submit(function (e) {

        e.preventDefault();
        if ($newMessage.val().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")) {
            socket.emit('send message',
                {
                    text: $newMessage.val().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                    user: $newUN.val().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                });
            $newMessage.val('');
        } else {
            console.log('Что-то пошло не так в send message');
        }
    });


    $userNameInput.submit(function (e) {
        e.preventDefault();
        if ($newUN.val().replace(/\s/ig, '')) { // проверка на пустоту
            $userNameInput.hide();
            $input.show();
            $sendbtn.show();
            $newMessage.show();

        }

        // Вставмяем имя в текст плейсхолдера сообщения
        $('#newMessage').attr("placeholder", $newUN.val() + ", напишите что-нибудь");

    })


    socket.on('new message', function (data) {
        if (data.msg != '') {
            $messages.append('<div class="message hyphenate"><p><name>' + data.user + ':</name>' + data.msg + '</p></div>');
            autoscroll();
        } else {
            $messages.append('<div class="message hyphenate"><p><name>' + data.user + ':</name>' + data.msg + '</p></div>');
            autoscroll();
        }
    });

    socket.on('loadOldMessages', function (docs) {
        for (var i = docs.length - 1; i >= 0; i--) {
            $messages.append('<div class="message hyphenate"><p><name>' + docs[i].user + ':</name>' + docs[i].msg + '</p></div>');
            autoscroll();
        }
        ;

    });


    //Обновление информации о песнях

    socket.on('infoUpdate', function (songInfo) {
        if (i == false) {
            time = 0;
        } else {
            time = 12000;
        }
        setTimeout(function () {
            $artist.text(songInfo.artist);
            $title.text(songInfo.title);
            $cover.attr('src', songInfo.coverUrl);
            console.log('Реклама-0');
            if (songInfo.coverUrl != 'nothing') {
                console.log('Реклама-1');
                if (songInfo.artist == "Реклама") {
                    console.log('Реклама-2');
                    $.ajax({
                        url: "images/default.png",
                    });
                } else {
                    $.ajax({
                        url: songInfo.coverUrl,
                    });
                }

            } else {
                $.ajax({
                    url: "images/artwork.png",
                });
                $cover.attr('src', 'images/artwork.png');
            }
            i = true;
        }, time)
        console.log(songInfo.title);


    });

    onSwipe($mainid, 'left', function () {
        alert('Left')
    })
    onSwipe($mainid, 'right', function () {
        alert('Right')
    })


    //автоскролл на дно
    function autoscroll() {

        try {
            document.getElementById('messages').scrollTop = 5550;
        } catch (err) {
            console.log(err)
        }
    };

    function getInfo() {
        $(document).get('/getInfo', function (data) {

        });
    };

    function getCover() {
        cover.src = 'images/artwork.png';
        $cover.attr('src', 'images/artwork.png');
        cover.onload = function () {
            $cover.attr('src', 'images/artwork.png');
        };
        cover.onerror = function () {
            $cover.attr('src', 'images/default.png');
        };


    };


});