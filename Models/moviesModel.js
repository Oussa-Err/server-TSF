const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "the name is a required field"],
        unique: true
    },
    description: {
        type: String,
        required: [true, "the description is a required field"],
    },
    duration: {
        type: Number,
        required: [true, "duration is required"]
    },
    rating: {
        type: Number,
        default: 1.0,

    },
    totalRating: {
        type: Number,
    },
    releaseYear: {
        type: Number,
        required: true
    },
    releaseDate: {
        type: Date(),
        required: true
    },
    genres: {
        type: String,
        required: true
    },
    directors: {
        type: Number,
        required: true
    }
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie