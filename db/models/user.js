const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: 'Укажите e-mail',
        unique: 'Такой e-mail уже существует'
    },
    password: {
        type: String,
        required: true
    },
    upicString: String
});

module.exports = mongoose.model('user', UserSchema);