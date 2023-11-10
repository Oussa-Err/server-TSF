const User = require('../Models/userModel')
const asyncErrHandler = require('./../utils/asyncErrHandler')
const jwt = require('jsonwebtoken')
const CustomError = require('../utils/customError')
const util = require('util')
const crypto = require('crypto')


const signToken = function (id) {
    return jwt.sign({ id }, process.env.SECRET_STR, { expiresIn: process.env.TOKEN_EXPIRATION })
}

exports.signUp = asyncErrHandler(async (req, res) => {
    const createdUser = await User.create(req.body)

    const token = signToken(createdUser._id)

    res.status(200).json({
        status: "success!",
        token,
        data: createdUser
    })
})


exports.login = asyncErrHandler(async (req, res, next) => {
    const { password, email } = req.body

    if (!password || !email) {
        const err = new CustomError('enter both password and email', 400)
        return next(err)
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        const err = new CustomError('User not found', 400);
        return next(err);
    }

    const isMatch = await user.comparePswAndPswdb(password, user.password);

    if (!isMatch) {
        const err = new CustomError('Password incorrect', 400);
        return next(err);
    }
    const token = signToken(user._id)

    res.status(200).json({
        status: "successs",
        token
    })
})

exports.protect = asyncErrHandler(async (req, res, next) => {
    // Read the token and check if it exist
    let token = req.headers.authorization

    if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1]
    }
    if (!token) {
        const err = new CustomError('you are not logged in', 401)
        next(err)
    }

    // Validate the token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR)

    // If the user exist
    const user = await User.findOne({ _id: decodedToken.id })
    if (!user) {
        next(new CustomError("User is missing, log in again", 401))
    }

    // If user changed password
    const bol = await user.isPasswordChanged(decodedToken.iat)
    if (bol) {
        console.log("executed")
        next(new CustomError("Password has been changed", 401))
    }



    // Allow user access route
    req.user = user
    next()
})

exports.restrict = (...roles) => {
    return (req, res, next) => {
        console.log(req.user)
        if (!req.user || !roles.includes(req.user.role)) {
            const msg = new CustomError('you cannot perform the task', 403);
            return next(msg);
        }
        next();
    };
}


exports.forgotPassword = asyncErrHandler(async (req, res, next) => {
    //Get User based on posted email
    const user = await User.findOne({ email: req.body.email })
    
    if (!user) {
        const err = new CustomError('this email does not exist', 400)
        next(err)
    }

    //generate a random reset token

    //send the token back to the user email



})

exports.resetPassword = asyncErrHandler(async (req, res, next) => {
})