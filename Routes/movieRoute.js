const express = require('express')
const moviesController = require('../Controllers/moviesController')

const router = express.Router()
const { getAllMovies } = moviesController
// router.param('id', moviesController.checkID)

router.route('/')
    .get(getAllMovies)
    .post(moviesController.validateBody, moviesController.createMovie)

router.route('/:id')
    .delete(moviesController.deleteMovie)
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)

module.exports = router