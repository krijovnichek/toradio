const mongoose = require('mongoose');
const crypto = require('crypto');
const db = mongoose.connect("mongodb://localhost/users");
let User = require('./db/models/user.js');

// User API

exports.createUser = function (userData) {
    let user = {
        username: userData.username,
        email: userData.email,
        // password: userData.password
        password: hash(userData.password) //                         TODO Включить HASH
    };
    console.log(user);
    return new User(user).save()
};

exports.getUser = function (id) {
    return User.findOne(id)
};


exports.checkUser = async function (userData) {
    const user = await User.findOne({username: userData.login});
    console.log(user);
    console.log("24 string done!");
    // console.log(userData.password);
    if (user.password === hash(userData.password)) {
        console.log("User password is ok");
        return user
    } else {
        console.log("Wrong pass 32");
        return user
    }

};


function hash(text) {
    return crypto.createHash('sha1')
        .update(text).digest('base64')
}