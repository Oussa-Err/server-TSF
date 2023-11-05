const User = require('../Models/userModel')
const asyncErrHandler = require('./../utils/asyncErrHandler')

exports.signUp = asyncErrHandler(async (req, res) => {
    console.log(req.body)
    const createdUser = await User.create(req.body)

    res.status(200).json({
        status: "success!",
        data: createdUser
    })
})