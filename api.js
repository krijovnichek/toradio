const mongoose = require('mongoose');
const crypto = require('crypto');
const db = mongoose.connect("mongodb://localhost/users");
let User = require('./db/models/User.js');

// User API

exports.createUser = function (userData) {
    let user = {
        username: userData.username,
        email: userData.email,
        password: hash(userData.password)
    };
    console.log(user);
    return new User(user).save()
};

exports.getUser = function (id) {
    return User.findOne(id)
};

exports.checkUser = function (userData) {
    return User
        .findOne({email: userData.email})
        .then(function (doc) {
            if (doc.password === hash(userData.password)) {
                console.log("User password is ok");
                return Promise.resolve(doc)
            } else {
                return Promise.reject("Error wrong")
            }
        })
};

function hash(text) {
    return crypto.createHash('sha1')
        .update(text).digest('base64')
}