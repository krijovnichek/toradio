const express = require('express');
var app = express();
var http = require('http').Server(app);
// const path = require('path');
let io = require('socket.io')(http);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// var passport = require('passport');
// var expressSession = require('express-session');
// const LocalStrategy = require('passport-local').Strategy;
// const flash = require('connect-flash');
// const bcrypt = require('bcryptjs');
// const passportSocketIo = require('passport.socketio');
// const cookieParser = require('cookie-parser');

// const saltRounds = 10
// const myPlaintextPassword = '1234'
// const salt = bcrypt.genSaltSync(saltRounds)

// const sessionStore = new (require("connect-mongo")(expressSession))({
//         url: "mongodb://localhost:27017/chatusersdb"
//     });


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

// const User = require('../db/models/user.js');
// const Message = require('../db/models/message.js');

mongoose.connect('mongodb://localhost/chat', (err) => {
  if (err) console.log('connection error => ',err)
});

app.use(express.static(path.join(__dirname, '..', '/public')));

// app.use(expressSession({secret: 'mySecretKey',
//   store:sessionStore,
//   resave: false,
//   saveUninitialized: false}));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());

// function findUser (username, callback) {
//   mongoose.model("User").findOne({ 'username' :  username }, (err, user) => {
//     // User not found
//     if (!user) {
//       console.log('User not found')
//       return callback(null)
//     }
//     return callback(null, user)
//   });
// }


// passport.serializeUser(function (user, cb) {
//   console.log('serializeUser => ',user);
//   cb(null, user.username)
// })

// passport.deserializeUser(function (username, cb) {
//   findUser(username, cb)
// })

// app.post('/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/auth'
// }))

// app.post('/signup', passport.authenticate('signup', {
//   successRedirect: '/',
//   failureRedirect: '/auth',
//   failureFlash : true 
// }));

// passport.use(new LocalStrategy(
//     (username, password, done) => {
//       // mongoose.model("User").find({ 'username' :  username }, 
//       // function(err, user) {
//       //   console.log('founded user =>', user)
//       // });

//       mongoose.model("User").findOne({ 'username' :  username }, (err, user) => {
//         console.log('try to find user =>', user.password, user[0]);
//         if (err) {
//           return done(err)
//         }

//         // User not found
//         if (!user) {
//           console.log('User not found')
//           return done(null, false)
//         }

//         // Always use hashed passwords and fixed time comparison
//         bcrypt.compare(password, user.password, (err, isValid) => {
//           if (err) {
//             return done(err)
//           }
//           if (!isValid) {
//             return done(null, false)
//           }
//           return done(null, user)
//         })
//       })
//     }
//   ))

// app.post('/login', (req,res) => {
// 	console.log(req.body);
// 	res.sendStatus(200);
// })

// app.get('/', isAuthenticated, (req, res) => {
//   res.sendFile(path.join(__dirname,'..', 'client', 'main.html'));
// });

// app.get('/getUsers', (req,res) => {
//   if (connectedUsers.length === 0) {
//     console.log('not found')
//     res.sendStatus(404);
//   } else {
//     console.log('users found')
//     res.send(connectedUsers);
//   }
// });

// function isAuthenticated (req, res, next) {
//   if (req.isAuthenticated())
//   { console.log('user is authenticated');
//     return next();
//   }
//   console.log('user is not authenticated');

//   res.redirect('/auth');
// }

// app.get('/auth', isAlreadyAuth, (req, res) => {
//   res.sendFile(path.join(__dirname,'..', 'client', 'auth.html'));
// });

// function isAlreadyAuth (req, res, next) {
//   if (req.isAuthenticated())
//   { console.log('user is authenticated');
//     return res.redirect('/');
//   } else {
//     return next();
//   }
// }

// passport.use('signup', new LocalStrategy({
//     passReqToCallback : true
//   },
//   function(req, username, password, done) {
//     findOrCreateUser = function(){
//       console.log('regustration=>',username);
//       // find a user in Mongo with provided username
//        mongoose.model("User").findOne({'username':new RegExp(username, 'i')},function(err, user) {
//         console.log(user);
//         // In case of any error return
//         if (err){
//           console.log('Error in SignUp: '+err);
//           return done(err);
//         }
//         // already exists
//         if (user && Object.keys(user).length !== 0) {
//           console.log('User already exists');
//           return done(null, false, 
//              req.flash('message','User Already Exists'));
//         } else {
//           // if there is no user with that email
//           // create the user
//           var newUser = new User();
//           // set the user's local credentials
//           newUser.username = username;
//           newUser.password = password;

//           // save the user
//           newUser.save(function(err) {
//             if (err){
//               console.log('Error in Saving user: '+err);  
//               throw err;  
//             }
//             console.log('User Registration succesful');    
//             return done(null, newUser);
//           });
//         }
//       });
//     }


     
//     // Delay the execution of findOrCreateUser and execute 
//     // the method in the next tick of the event loop
//     process.nextTick(findOrCreateUser);
//   }));

http.listen(3301, () => {
	console.log('Server is listenin on port 3301');
});

// io.use(passportSocketIo.authorize({
//   key: 'connect.sid',
//   secret: 'mySecretKey',
//   store: sessionStore,
// }));

let connectedUsers = [];

// function checkUsers(user, socketId) {
    
//     for (let i = 0; i < connectedUsers.length; i++) {
//       const item = connectedUsers[i];
//       if (item.username === user.username) {
//         item.socketId = socketId;
//         return;
//       }        
//     }
//     console.log('new client is connected');
//     const obj = {
//       username: user.username,
//       socketId: socketId
//     };
//     connectedUsers.push(obj);
  
// }

function getAllMessages() {
  var mes = Message.find({});
  return mes;
}

io.on('connection', (socket) => {
  let allMessages = null;
  // checkUsers(socket.request.user, socket.id);
  console.log('connectedUsers =>',connectedUsers)
  allMessages = Message.find({}, (err, messages) => {
     
    return messages
  });

  // console.log(allMessages.content);

  // let userName = null;
  // socket.on('send name', (name) => {
  //   userName = name;
  // });
  // socket.on('send message', (data) => {

  //   const message = new Message();
  //   message.userFrom = data.userFrom;
  //   message.userTo = data.userTo;
  //   message.content = data.message;
  //   // save the user
  //   message.save(function(err) {
  //     if (err){
  //       console.log('Error in Saving message: '+err);  
  //       throw err;  
  //     }
  //     console.log('Message saved succesful');    
  //   });

  //   let userId = null;
  //   for (let i = 0; i < connectedUsers.length; i++) {
  //     const item = connectedUsers[i];
  //     if (item.username === data.userTo) {
  //       userId = item.socketId;
  //     }
      
  //   }

  //   const obj = {
  //   	date: new Date(),
  //   	content: data.message,
  //   	username: data.userFrom 
  //   }

    // socket.broadcast.to(userId).emit('recieve message', obj);
  // });

  // socket.on('disconnect', function () {
  //   console.log('user disconnected', socket.request.user );
  // });
})
