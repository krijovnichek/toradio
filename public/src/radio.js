// CLIENT 2.0


$(function () {
    const socket = io.connect();
    const $artist = $('#artist');
    const $title = $('#title');
    let $cover = $('#cover');
    let cover = new Image();
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


    function getCover() {
        cover.src = 'images/artwork.png';
        $cover.attr('src', 'images/artwork.png');
        cover.onload = function () {

            if (isAdv) {
                $cover.attr('src', 'images/default.png');
            }
            $cover.attr('src', 'images/artwork.png');
        };
        cover.onerror = function () {
            $cover.attr('src', 'images/default.png');
        };

    }


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


});