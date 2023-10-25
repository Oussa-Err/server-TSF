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
        required: [true, 'Duration is required field!']
    },
    ratings: {
        type: Number,
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

movieSchema.post('save', function (next) {
    const content = `\n\nA new movie document with name ${this.name} has been created by ${this.createdBy} at ${this.createdAt}`
    fs.writeFileSync('log/log.txt', content, { flag: 'a' }, (err) => {
        console.log(err)
    })
    next()
})

// query middleware
movieSchema.pre('find', function(next){
    this.find({releaseYear: {$lte: Date.now()}})
    this.entryTiming = Date.now()
    next()
})

movieSchema.post("find", function(doc, next){
    const endingTime = Date.now()
    const content = `\n\ntime took to fetch is: ${endingTime - this.entryTiming} milliseconds`
    fs.writeFileSync("log/log.txt", content, {flag: "a"}, (err) => {
        console.log(err)
    })
console.log(doc)
    next()
})


const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie