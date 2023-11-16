const mongoose = require('mongoose')
const validator = require('validator')
const fs = require('fs')
const bcrypt = require('bcrypt')
const crypto = require('crypto')


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
        minlength: [8, 'minimum 8 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    confirmedPassword: {
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            // The validator will only be triggred for save() and create()
            validator: function (pwd) {
                return this.confirmedPassword === this.password
            },
            message: "Confirmed password & Password should match"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date
})

userSchema.pre('save', async function (next) {
    this.createdBy = this.name;

    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmedPassword = undefined;
    next();
    return next(error);
});

userSchema.post('save', function (doc, next) {
    const content = `\n\nA new user with name ${this.name} has been created by ${this.createdBy} at ${this.createdAt}`
    fs.writeFileSync('log/log.txt', content, { flag: 'a' }, (err) => {
        console.log(err.message)
    })
    next()
})

userSchema.methods.comparePswAndPswdb = async function (psw, pswdb) {
    return await bcrypt.compare(psw, pswdb)
}

userSchema.methods.isPasswordChanged = async function (JWTtimeStamp) {
    if (this.createdAt) {
        const createAtTimeStamp = parseInt(this.createdAt.getTime() / 1000, 10)
        return JWTtimeStamp < createAtTimeStamp
    }
    return false
}

userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetToken = hashedToken;
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    return resetToken
};

const User = mongoose.model('User', userSchema)

module.exports = User