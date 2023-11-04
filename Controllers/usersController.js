const User = require('../Models/userModel')
const asyncErrHandler = require('./../utils/asyncErrHandler')

exports.signUp = asyncErrHandler(async (req, res, next) => {
    console.log(req.body)
    try {
        const createdUser = await User.create(req.body)

        res.status(200).json({
            status: "success!",
            data: createdUser
        })
    } catch (err) {
        res.status(500).json({
            status: "fail!",
            message: err.message
        })
    }
})