const Movie = require("../Models/moviesModel")
const ApiFeatures = require("../utils/ApiFeatures.js")
const asyncErrHandler = require('./../utils/asyncErrHandler')
const CustumError = require('./../utils/customError')

//MANIPULATING THE REQUEST
// api/v1/movies/highest-ratings
exports.getHighestRatings = async (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratings'

    next()
}


// route handlers:

exports.getAllMovies = asyncErrHandler(async (req, res) => {
    const features = new ApiFeatures(Movie.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()

    const movies = await features.query

    res.status(200).json({
        status: "success!",
        length: movies.length,
        data: {
            movies
        }
    })
})

exports.getMovie = async (req, res, next) => {
    // const movies = await Movie.find({_id: req.params.id})
    // or
    const movie = await Movie.findById(req.params.id)

    if (!movie) {
        const error = new CustumError(`this ${req.params.id} is not found`, 404)
        return next(error)
    }

    res.status(200).json({
        status: "success!",
        data: {
            movie
        }
    })

}

exports.createMovie = asyncErrHandler(async (req, res) => {
    const createdMovie = await Movie.create(req.body)

    res.status(201).json({
        status: "created!",
        data: {
            createdMovie
        }
    })

})

exports.updateMovie = async (req, res, next) => {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!updatedMovie) {
        const error = new CustumError(`this ${req.params.id} is not found`, 404)
        return next(error)
    }

    res.status(200).json({
        status: "resource updated successfully",
        data: {
            movie: updatedMovie
        }
    })
}

exports.deleteMovie = async (req, res, next) => {

    const deletedMovie = await Movie.findByIdAndDelete(req.params.id)

    if (!deletedMovie) {
        const error = new CustumError(`this ${req.params.id} is not found`, 404)
        return next(error)
    }

    res.status(200).json({
        status: "success!",
        data: null
    })
}

exports.getMovieStats = asyncErrHandler(async (req, res) => {

    const stats = await Movie.aggregate([
        { $match: { ratings: { $gte: 4.5 } } },   // this is a stage
        {
            $group: {
                _id: "$releaseYear",
                avgRating: { $avg: '$ratings' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
                priceTotal: { $sum: "$price" },
                movieCount: { $sum: 1 }
            }
        },
        { $limit: 6 }
    ])

    res.status(200).json({
        message: "success",
        count: stats.length,
        data: {
            stats
        }
    })
})

exports.getMovieByGenre = asyncErrHandler(async (req, res) => {
    const genre = req.params.genre
    const movies = await Movie.aggregate([
        { $unwind: '$genres' },
        {
            $group: {
                _id: "$genres",
                movieCount: { $sum: 1 }
            }
        },
        { $addFields: { genre: "$_id" } },
        // {$sort: {movieCount: 1}},
        { $project: { _id: 0 } },
        { $match: { genre: genre } }
    ])

    res.status(200).json({
        message: "success",
        count: movies.length,
        data: {
            movies
        }
    })
})