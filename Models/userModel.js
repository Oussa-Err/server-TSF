const mongoose = require('mongoose')
const validator = require('validator')
const fs = require('fs')
const bcrypt = require('bcrypt')


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
        required: [true, 'please confirm your password'],
        validate: {
            // The validator will only be triggred for save() and create()
            validator: function(pwd) {
                return this.confirmedPassword === this.password
            },
            message: "Confirmed password & Password should match"
        }
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString(),
        select: false
    },
})



userSchema.pre('save', async function(val, next){
    this.createdBy = this.name
    if(!this.isModified) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmedPassword = undefined
})

userSchema.post('save', function (doc, next) {
    const content = `\n\nA new user with name ${this.name} has been created by ${this.createdBy} at ${this.createdAt}`
    fs.writeFileSync('log/log.txt', content, { flag: 'a' }, (err) => {
        console.log(err.message)
    })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
