const User = require('../Models/userModel')
const asyncErrHandler = require('./../utils/asyncErrHandler')
const jwt = require('jsonwebtoken')
const CustomError = require('../utils/customError')
const util = require('util')
const sendMail = require('../utils/send')
const crypto = require("crypto")


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
        next(new CustomError("Password has been changed", 401))
    }

    // Allow user access route
    req.user = user
    next()
})

exports.restrict = (...roles) => {
    return (req, res, next) => {
        console.log(req.user)
        if (!req.user || req.user.role !== "admin") {
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

    //Generate a random reset token
    const resetToken = user.createResetPasswordToken()
    console.log(resetToken + '\n' + user)
    await user.save({ validateBeforeSave: false })
    //send the token back to the user email
    const resetUrl = `${req.protocol}://${req.get('host')}/users/reset-password/${resetToken}`
    const text = `we have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}\n\nThe link expires in 10 min`
    try {
        console.log("1-executed..")
        await sendMail({
            email: user.email,
            subject: "Password change request received",
            text: text
        })

        res.status(200).json({
            status: "success",
            message: "Password reset link sent to the user email"
        })
    } catch (err) {
        console.log("2-executed..")
        user.passwordResetToken = undefined
        user.passwordResetTokenExpires = undefined
        await user.save({ validateBeforeSave: false })

        next(new CustomError("there was an error sending password reset email. Please try again later", 500))
    }
})

exports.resetPassword = asyncErrHandler(async (req, res, next) => {
    const token = crypto.createHash("sha256").update(req.params.token).digest('hex')

    const {password, confirmedPassword} = req.body

    if(!password || !confirmedPassword){
        next(new CustomError("please enter a password and confirm it"), 400)
    }

    const user = await User.findOne({ passwordResetToken: token, passwordResetTokenExpires: {$gt: Date.now()}})

    if(!user){
        next(new CustomError("Token is invalid or password reset token expired", 400))
    }

    user.password = password
    user.confirmedPassword = confirmedPassword
    user.passwordResetToken = undefined
    user.passwordResetTokenExpires = undefined
    
    user.save()

    // log the user
    const loginToken = signToken(user._id)

    res.status(200).json({
        status: "successs",
        token: loginToken
    })
})