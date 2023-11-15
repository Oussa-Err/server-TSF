const express = require('express')
const usersController = require('../Controllers/usersController')

const router = express.Router()


router.route('/signup')
    .post(usersController.signUp)

router.route('/login')
    .post(usersController.login)

router.route('/forgot-password')
    .post(usersController.forgotPassword)

router.route('/reset-password/:token')
    .patch(usersController.resetPassword)
    
module.exports = router