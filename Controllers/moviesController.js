const Movie = require("../Models/moviesModel")
const ApiFeatures = require("../utils/ApiFeatures.js")
const asyncErrHandler = require('./../utils/asyncErrHandler')

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

exports.getMovie = asyncErrHandler(async (req, res) => {
    // const movies = await Movie.find({_id: req.params.id})
    // or
    const movie = await Movie.findById(req.params.id)

    res.status(200).json({
        status: "success!",
        data: {
            movie
        }
    })

})

exports.createMovie = asyncErrHandler(async (req, res) => {
    const movie = await Movie.create(req.body)

    res.status(201).json({
        status: "created!",
        data: {
            movie
        }
    })

})

exports.updateMovie = asyncErrHandler(async (req, res) => {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    res.status(200).json({
        status: "resource updated successfully",
        data: {
            movie: updatedMovie
        }
    })
})

exports.deleteMovie = asyncErrHandler(async (req, res) => {

    await Movie.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status: "success!",
        data: null
    })
})

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