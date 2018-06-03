

$(function(){
            var socket = io.connect();
            var $input = $('#input'); 
            var $newMessage = $('#newMessage');
            var $messages = $('#messages');
            var $userName = $('#userName');
            var $userNameInput = $('#userNameInput');
            var $newUN = $('#newUserName');
            var $artist = $('#artist');
            var $title = $('#title');
            var $cover = $('#cover');
            var cover = new Image();   
                    

            getCover();

                      
            


            //Обновление информации о песнях
            socket.on('infoUpdate', function(songInfo){
                console.log("Инфа пришла");
                $artist.text(songInfo.artist);
                $title.text(songInfo.title);
                $cover.attr('src','images/artwork.png');
                $.ajax({
                    url: "images/artwork.png",
                    });              
                //setTimeout(getCover(), 2000);
                getCover();
                
            });




            
             //автоскролл на дно
            function autoscroll(){
                document.getElementById('messages').scrollTop=5550;
            };

            function getInfo(){
                $(document).get('/getInfo', function(data) {
                    //data.artist;
                    console.log("QWerty");
                });   
            };  

            function getCover(){
                cover.src = 'images/artwork.png';
                console.log("getCover Сработало");
                $cover.attr('src', 'images/artwork.png');
                cover.onload = function(){
                    console.log("Сработало");
                    $cover.attr('src', 'images/artwork.png');
                };
                cover.onerror = function(){
                    $cover.attr('src', 'images/default.png');
                };

                                   
            };


            

            
       
});