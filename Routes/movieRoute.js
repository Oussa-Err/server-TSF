const express = require('express')
const moviesController = require('../Controllers/moviesController')

const router = express.Router()
const { getAllMovies, validateBody, deleteMovie, updateMovie, getMovie, createMovie } = moviesController
// router.param('id', moviesController.checkID) // we won't need this moongose does it for a living

router.route('/')
    .get(getAllMovies)
    .post(validateBody, createMovie)

router.route('/:id')
    .delete(deleteMovie)
    .get(getMovie)
    .patch(updateMovie)

module.exports = router