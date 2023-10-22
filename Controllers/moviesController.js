const Movie = require("../Models/moviesModel")


exports.getHighestRatings = async (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratings'

    next()
}

exports.getAllMovies = async (req, res) => {
    try {

        //ADVANCE FILTER 
        let queryStr = JSON.stringify(req.query)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        const queryObj = JSON.parse(queryStr)

        let query = Movie.find(queryObj)

        //SORTING LOGIC
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy); 
        } else {
            query = query.sort('-createdAt');
        }
        
        //QUERY FIELDS
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        }else {
            query = query.select('-__v')
        }

        //PAGINATION
        const page = req.query.page*1 || 1
        const limit = req.query.limit*1 || 10
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)

        if(req.query.page){
            const countDocs = await Movie.countDocuments()
            if(skip >= countDocs){
                throw new Error('this page is not found')
            }
        }

        const movies = await query

        res.status(200).json({
            status: "success!",
            length: movies.length,
            data: {
                movies
            }
        })
    } catch (err) {
        res.status(404).json({
            staus: "fail!",
            message: err.message
        })
    }
}

exports.getMovie = async (req, res) => {
    try {
        // const movies = await Movie.find({_id: req.params.id})
        // or
        const movie = await Movie.findById(req.params.id)

        res.status(200).json({
            status: "success!",
            data: {
                movie
            }
        })
    } catch (err) {
        res.status(404).json({
            status: "not found",
            message: err.message
        })
    }
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

exports.updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        res.status(200).json({
            status: "resource updated successfully",
            data: {
                movie: updatedMovie
            }
        })
    } catch (err) {
        res.status(404).json({
            status: "Not found!",
            message: err.message
        })
    }
}

exports.deleteMovie = async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: "success!",
            data: null
        })
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err.message
        })
    }
}

