const User = require('../Models/userModel')
const asyncErrHandler = require('./../utils/asyncErrHandler')
const jwt = require('jsonwebtoken')
const CustomError = require('../utils/customError')

exports.signUp = asyncErrHandler(async (req, res) => {
    const createdUser = await User.create(req.body)

    const token = jwt.sign({ _id: createdUser._id }, process.env.SECRET_STR, { expiresIn: 9634535635 })

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
        const err = new CustomError('enter both password and email', 404)
        return next(err)
    }

    const user = await User.findOne({ email }).select()

    res.status(200).json({
        status: "successs",
        token: "",
        user
    })
})