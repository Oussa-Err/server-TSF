const mongoose = require('mongoose')
const fs = require('fs')

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required field!'],
        unique: true,
        maxlength: [100, "Movie name must not have more than 100 characters"],
        minlength: [4, "Movie name must have at least 4 charachters"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required field!'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required field!'],
        min: [40, "the movie's duration must be gt than 40m"],
        max: [200, "the movie's duration must be less than 200m"]
    },
    ratings: {
        type: Number,
        validate: {
            validator: function () {
                return this.ratings >= 1.0 && this.ratings <= 10.0
            },
            message: "should be between 1.0 and 10.0 not {VALUE}"
        }
    },
    totalRating: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release year is required field!']
    },
    releaseDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    genres: {
        type: [String],
        required: [true, 'Genres is required field!'],
        // enum: {
        //     value: ["Action", "Sci-Fi", "Drama", "Comedie", "Thriller"],
        //     message: "the movie should contain only these movies {{VALUE}}"
        // }
    },
    directors: {
        type: [String],
        required: [true, 'Directors is required field!']
    },
    coverImage: {
        type: String,
        require: [true, 'Cover image is required field!']
    },
    actors: {
        type: [String],
        require: [true, 'actors is required field!']
    },
    price: {
        type: Number,
        require: [true, 'Price is required field!']
    },
    createdBy: {
        type: String
    }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } })



// virtual property
movieSchema.virtual('durationInHours').get(function () {
    return this.duration / 60
})


// MIDLEWARES:
// save() or create() is triggered
// insertMany and findByIdAndUpdate won't be triggred
movieSchema.pre('save', function (next) {
    this.createdBy = 'ouss'
    next()
})

movieSchema.post('save', function (doc, next) {
    const content = `\n\nA new movie document with name ${this.name} has been created by ${this.createdBy} at ${this.createdAt}`
    fs.writeFileSync('log/log.txt', content, { flag: 'a' }, (err) => {
        console.log(err)
    })
    next()
})

// query middleware
movieSchema.pre(/^find/, function (next) {
    this.find({ releaseYear: { $lte: new Date().getFullYear() } })
    this.entryTiming = Date.now()
    next()
})

movieSchema.post(/^find/, function (_, next) {
    this.find({ releaseYear: { $lte: new Date() } })
    const endingTime = Date.now()
    const content = `\n\ntime took to fetch is: ${endingTime - this.entryTiming} milliseconds`
    fs.writeFileSync("log/log.txt", content, { flag: "a" }, (err) => {
        console.log(err)
    })

    next()
})

movieSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { releaseYear: { $lte: new Date().getFullYear() } } })

    next()
})


const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie