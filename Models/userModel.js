const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter your name'],
        minlength: [3, 'user name must take at least 3 characters']
    },
    email: {
        type: String,
        required: [true, 'please enter a email'],
        validate: [validator.isEmail, 'please enter a valid email'],
        unique: true,
        lowercase: true
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'please enter a password'],
        minlength: [8, 'minimum 8 characters']
    },
    confirmedPassword: {
        type: String,
        required: [true, 'please confirm your password']
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User
