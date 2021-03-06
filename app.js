const express = require('express');
const ua = require('express-mobile-redirect');
const bodyParser = require('body-parser');
const app = express();
const app2 = express();
const server = require('http').createServer(app);
const server2 = require('http').createServer(app2);
const io = require('socket.io').listen(server);
const io2 = require('socket.io').listen(server2);
const mongoose = require('mongoose');
const crypto = require('crypto');
let url = require('url');
const fs = require('fs');
const config = require('./config.json');
const public_config = require('./config.json');
let songInfo;
let song_len;
let request = require('request');
const http = require('http');
const https = require('https');
request = require('superagent');
const superagentPromisePlugin = require('superagent-promise-plugin');
const util = require('util');
let coverUrl;


const key = config.secret_key;
let art;
let song;

const mobile_address = config.mobile_host+config.mobile_port;
app.use(ua.mobileredirect(mobile_address));
app.use(ua.tabletredirect(mobile_address, true)); //true

regUsers = [
	{name: "rooz", password: "qwerty"},
	{name: "lalera", password: "qwerty"}
];

users = [];
connections = [];

server.listen(process.env.PORT || public_config.port, function(){
	console.log('Start listening ' + public_config.host + ':' + +public_config.port);
} );


// Коннектимся к БД
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/chat', function(err){
	if (err) console.log (err);
		console.log('Conneced to MongoDB');
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){

	res.sendFile(__dirname + '/public/index.html');
});

app.get('/test', function(req, res){

	res.sendFile(__dirname + '/public/test.html');
});

app.get('/404', function(req, res){
  res.sendFile(__dirname + '/public/404.html');
});






//Отправка songInfo
app.get('/update', function(req, res){
	console.log(req.query);
	if (req.query.key === key) {
		song_len = req.query.seconds;
		songInfo = {
			artist: req.query.artist, title: req.query.title
		};
		res.sendStatus(200);
		getCover(req.query.artist, req.query.title);
		try{
			setTimeout(function(){
				songInfo.coverUrl = coverUrl;
				io.sockets.emit('infoUpdate', {
				artist: songInfo.artist, title: songInfo.title, coverUrl: coverUrl
			});
			}, 2500)
			
		}
		catch (err) {
			console.log(err);
		}

	}
	
	else {
		res.sendStatus(403);
		console.log("Попытка внести некорректные данные");
		console.log(req.query.key);
	};

});

app.get('/getInfo', function(req, res){
	res.send(songInfo);
	res.sendStatus(200);
});


app.get('*', function(req, res){
  res.redirect('/404');
});




const chatSchema = mongoose.Schema ({
	user: String,
	msg: String,
	created: {type: Date, default: Date.now}
});

const userSchema = mongoose.Schema ({
	nickname: String,
	email: {
		type: String,
		required: 'Укажите e-mail',
		unique: 'Такой e-mail уже существует'
	},
	passwordHash: String,
	salt: String,
}, {
	timestamps: true
});
userSchema.virtual('password')
	.set(function (password) {
		this._plainPassword = password;
		if (password) {
			this.salt = crypto.randomBytes(128).toString('base64');
			this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
		} else {
			this.salt = undefined;
			this.passwordHash = undefined;
		}
	})
	.get (function () {
		return this._plainPassword;
	});
	userSchema.methods.checkPassword = function (password) {
		if (!password) return false;
		if (!this.passwordHash) return false;
		return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') === this.passwordHash;
};

const User = mongoose.model('User', userSchema);


const Chat = mongoose.model('Message', chatSchema);

io.sockets.on('connection', function(socket){
	var query = Chat.find({});
	query.sort('-created').limit(20).exec(function (err, docs) {
		if (err) {
			throw err;
		}
		else {
			socket.emit('loadOldMessages', docs);
			try {
				socket.emit('infoUpdate', {artist: songInfo.artist, title: songInfo.title});
			}
			catch (err) {
				console.log(err);
			};
		};
	connections.push(socket);
	console.log('Connected. %s sockets connected', connections.length);
});

//Disconnected
socket.on('disconnect', function(data){
	connections.splice(connections.indexOf(socket), 1);
	console.log ('Disconnected. %s sockets connected', connections.length);
});

	//Send Message
	socket.on('send message', function(data){
		var newMsg = new Chat ({msg: data.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), user: data.user.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") });
		newMsg.save(function(err){
			if (err) {
				console.log(err);
			}
			else {
			socket.broadcast.emit('new message',{msg: data.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), user: data.user.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")});
			socket.emit('new message', {msg: data.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), user: '<me>'+data.user.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")+'</me>'});
			};
		});
	});
	
});



function getCover(artist, title) {
	var q_ar = 'artist=' + artist;
	var q_tit ='track=' + title;
	
	 request
   .get('http://ws.audioscrobbler.com/2.0/')
   .query ('method=track.getinfo')
   .query ('api_key=e6fb3758d63c82057579ebe937e7d9d3')
   .query (q_ar)
   .query (q_tit)
   .query ('format=json')
   .end(function(err, res){
   		
		try{	str_url = JSON.stringify(res.body.track.album.image[3]);
				str_url = str_url.replace(/#/g, '');
				url = JSON.parse(str_url);
				coverUrl = url.text;
				console.log('URL: ' +  coverUrl);

					try {
						var file = fs.createWriteStream("/var/www/radio/toradio/public/images/artwork.png");
						var request = https.get(coverUrl, function(response) {
						  response.pipe(file);
						  console.log("File created")
						});
					} 
					catch(err) {
						console.log(err);
					}



				return  coverUrl;
			}
			catch(err) {
				console.log(err);
				coverUrl = 'nothing'
				return  coverUrl;

			}
		
     });
     return coverUrl;
 }







//APP2 HERE

server2.listen(process.env.PORT || public_config.mobile_port, function(){
	console.log('Start listening '+ config.mobile_port +'...');
} );
app2.use(ua.is_mobile()); // Detects mobiles and sets req.is_mobile 
app2.use(ua.is_tablet()); // Detects tablets and sets req.is_tablet 
app2.use(express.static(__dirname + '/public'));
// app2.use(express.static(path.join(__dirname, 'public')))
app2.get('/', function(req, res) {
        return res.sendFile(__dirname + '/public/index-mobile.html');
});



app2.get('/update', function(req, res){
	if (req.query.key === key) {

		song_len = req.query.seconds;
		songInfo = {artist: req.query.artist, title: req.query.title};
		console.log(songInfo);
		res.sendStatus(200);
		try{
			setTimeout(function(){
				songInfo.coverUrl = coverUrl;
				console.log("Отправка "+songInfo.coverUrl);
				io2.sockets.emit('infoUpdate', {
				artist: songInfo.artist, title: songInfo.title, coverUrl: coverUrl
			});
			}, 2500)
			
		}
		catch (err) {
			console.log(err);
		}
	}
	
	else {
		res.sendStatus(403);
	}

});

app2.get('/getInfo', function(req, res){
	res.send(songInfo);
	res.sendStatus(200);
	console.log("send status OK");
});


try { 
	io2.sockets.on('connection', function(socket){
	console.log("Зашел в sockets on");
	try {
			socket.emit('infoUpdate', {artist: songInfo.artist, title: songInfo.title});
			console.log("2 socket.emit OK");
		}
		catch (err) {
			console.log(err + "io2.sockets");
		};
	

	


//Disconnected
socket.on('disconnect', function(data){
	connections.splice(connections.indexOf(socket), 1);
	});
});
}

catch (err){
	console.log(err + " sockets on");
}


