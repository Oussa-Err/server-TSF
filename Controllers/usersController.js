const User = require('../Models/userModel')
const asyncErrHandler = require('./../utils/asyncErrHandler')
const jwt = require('jsonwebtoken')
const CustomError = require('../utils/customError')


const signToken = function (id) {
    return jwt.sign({ id: id }, process.env.SECRET_STR, { expiresIn: 2592000000 })
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
    console.log(req.body)
    const { password, email } = req.body

    if (!password || !email) {
        const err = new CustomError('enter both password and email', 400)
        return next(err)
    }

    const user = await User.findOne({ email }).select("+password")
    const token = signToken(user._id)

    if (!user) {
        const err = new CustomError('User not found', 400);
        return next(err);
    }

    const isMatch = await user.comparePswAndPswdb(password, user.password);

    if (!isMatch) {
        const err = new CustomError('Password incorrect', 400);
        return next(err);
    }

    res.status(200).json({
        status: "successs",
        token
    })
})