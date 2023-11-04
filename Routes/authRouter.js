const express = require('express')
const usersController = require('../Controllers/usersController')

const router = express.Router()


router.route('/signup')
    .post(usersController.signUp)

// router.route('/login/:id')
//     .get()


// router.route('/dashboard')
//     .get()

module.exports = router