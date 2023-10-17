const express = require('express')
const moviesController = require('../Controllers/moviesController')

const router = express.Router()

// router.param('id', moviesController.checkID)

router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.validateBody, moviesController.createMovie)

router.route('/:id')
    .delete(moviesController.deleteMovie)
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)

module.exports = router