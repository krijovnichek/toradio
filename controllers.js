// При удачной авторизации данные пользователя будут храниться в req.user
const passport = require("passport");
const mongoose = require('mongoose');
let User = mongoose.model('User');
const api = require('./api');


module.exports.index = function (req, res, next) {
    if (req.session.user) {
        res.redirect("/radio");
    } else {

        /* let data = {
             title: 'Express',
         };
         res.render('index', data);*/
        res.sendFile(__dirname + '/public/panheadfm.html');
    }
};

module.exports.radio = function (req, res, next) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/public/radio.html');


    }
};

module.exports.login = function (req, res, next) {
    res.sendFile(__dirname + '/public/login.html');
};

// Здесь все просто =)
module.exports.logout = function (req, res) {
    req.session.destroy();
    req.logout();
    res.redirect('/');
};

// Регистрация пользователя. Создаем его в базе данных, и тут же, после сохранения, вызываем метод `req.logIn`, авторизуя пользователя
module.exports.register = function (req, res, next) {

    console.log(req.query);
    console.log("SЫ");
    res.sendStatus(200);
    res.redirect('/');

    /*let user = new User({username: req.query.email, password: req.query.password});
    user.save(function (err) {
        console.log("user save");
        return err
            ? next(err)
            : req.logIn(user, function (err) {
                return err
                    ? next(err)
                    : res.redirect('/private');
            });
    });*/
};

module.exports.newuser = function (req, res, next) {
    // res.sendStatus(200);
    api.createUser(req.query);
    // res.sendStatus(200);
    res.redirect('/');
};

module.exports.checkUser = function (req, res, next) {
    // console.log(req.query);
    // console.log(api.checkUser(req.query));
    api.checkUser(req.query).then(function (user) {
        console.log("81 function");
        if (user) {
            console.log(user);
            req.session.user = {id: user._id, name: "TEST"};
            console.log(req.session);
            // res.session.user = {id: user._id, name: user.username};
            res.redirect('/')
        } else {
            console.log("Err 88")
        }
    })
};

module.exports.test = function (req, res, next) {
    if (req.session.user) {

        // console.log(req.session.user);
        res.sendFile(__dirname + '/public/404.html');
        // res.session
        /*let data = {
            title: 'Express',
            user : req.session.user
        };
        res.render('index', data);*/
    } else {
        console.log("TEST ELSE");
        console.log(req.session.user);

        /* let data = {
             title: 'Express',
         };
         res.render('index', data);*/
        res.redirect('/');
    }
};