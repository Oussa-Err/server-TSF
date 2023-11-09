const express = require('express')
const moviesController = require('../Controllers/moviesController')
const usersController = require('../Controllers/usersController')
const router = express.Router()

const { getAllMovies, deleteMovie, updateMovie, getHighestRatings, getMovie, createMovie, getMovieStats, getMovieByGenre } = moviesController

const {protect, restrict} = usersController

// router.param('id', moviesController.checkID) // we won't need this moongose does it for a living

//ALIASES 
router.route('/highest-ratings')
    .get(protect, getHighestRatings, getAllMovies)

router.route('/stats')
    .get(protect, getMovieStats)

router.route('/movies-by-genre/:genre')
    .get(protect, getMovieByGenre)

router.route('/')
    .get(protect, getAllMovies)
    .post(protect, restrict('admin'), createMovie)

router.route('/:id')
    .delete(protect, restrict('admin'), deleteMovie)
    .get(protect, getMovie)
    .patch(protect, restrict(''), updateMovie)

module.exports = router