const fs = require('fs')

let movies = JSON.parse(fs.readFileSync('./Data/movies.json'))

exports.validateBody = (req, res, next) => {
    if (!req.body.name || !req.body.releaseYear) {
        return res.status(404).json({
            status: "fail!",
            message: "the request body is undefined"
        })
    }

    next()
}

exports.getAllMovies = (req, res) => {
    
}

exports.getMovie = (req, res) => {
    
}

exports.updateMovie = (req, res) => {
    
}

exports.deleteMovie = (req, res) => {

}

exports.addMovie = (req, res) => {

}
