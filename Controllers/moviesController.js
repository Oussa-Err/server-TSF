const fs = require('fs')
const Movie = require("../Models/moviesModel")

exports.validateBody = (req, res, next) => {
    if (!req.body.name) {
        return res.status(404).json({
            status: "fail!",
            message: "the request body is undefined"
        })
    }

    next()
}

exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find()

        res.status(200).json({
            status: "success!",
            length: movies.length,
            data: {
                movies
            }
        })
    }catch(err){
        res.status(404).json({
            staus: "not found",
            message: err.message
        })
    }
}

exports.getMovie = (req, res) => {

}

exports.createMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body)

        res.status(201).json({
            status: "created!",
            data: {
                movie
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}

exports.updateMovie = (req, res) => {

}

exports.deleteMovie = (req, res) => {

}

