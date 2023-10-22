const express = require('express')
const moviesController = require('../Controllers/moviesController')

const router = express.Router()
const { getAllMovies, deleteMovie, updateMovie, getHighestRatings, getMovie, createMovie } = moviesController
// router.param('id', moviesController.checkID) // we won't need this moongose does it for a living

//ALIASES 
router.route('/highest-ratings')
    .get(getHighestRatings, getAllMovies)


router.route('/')
    .get(getAllMovies)
    .post(createMovie)

router.route('/:id')
    .delete(deleteMovie)
    .get(getMovie)
    .patch(updateMovie)

module.exports = router