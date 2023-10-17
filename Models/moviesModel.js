const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "the name is a required field"],
        unique: true
    },
    description: String,
    duration: {
        type: Number,
        required: [true, "duration is required"]
    },
    rating: {
        type: Number,
        default: 1.0
    }
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie