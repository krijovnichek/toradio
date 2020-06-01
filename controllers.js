// При удачной авторизации данные пользователя будут храниться в req.user
const passport = require("passport");
const mongoose = require('mongoose');
let User = mongoose.model('User');
const api = require('./api');


module.exports.index = function (req, res, next) {
    res.sendFile(__dirname + '/public/index.html');
};

module.exports.login = function (req, res, next) {
    passport.authenticate('local',
        function (err, user, info) {
            console.log("logIn");
            /*            return err
                            ? next(err)
                            : user
                                ? req.logIn(user, function(err) {
                                    return err
                                        ? next(err)
                                        : res.redirect('/private');
                                })
                                : res.redirect('/');*/
        }
    )(req, res, next);
};

// Здесь все просто =)
module.exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};

// Регистрация пользователя. Создаем его в базе данных, и тут же, после сохранения, вызываем метод `req.logIn`, авторизуя пользователя
module.exports.register = function (req, res, next) {
    // console.log(req.query);

    let user = new User({username: req.query.email, password: req.query.password});
    user.save(function (err) {
        console.log("user save");
        return err
            ? next(err)
            : req.logIn(user, function (err) {
                return err
                    ? next(err)
                    : res.redirect('/private');
            });
    });
};

module.exports.newuser = function (req, res, next) {
    api.createUser(req.query);
};