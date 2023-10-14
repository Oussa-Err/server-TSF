const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const app = require('./app')
const mongoose = require('mongoose')


mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true
})
.then(connection => console.log("DB connection Successful"))
.catch((error) => console.log("not working because of this error: "+error))


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

const testMovie = new Movie({
    name: "Home Alone",
    description: "Action packed movie staring bruce wilis in this trilling adventure",
    duration: 123,
    rating: 4.5
})

testMovie.save()
.then(data => console.log(data))
.catch(err => console.log("the error is "+ err))

if (process.env.NODE_ENV === 'development') {
    app.listen(process.env.PORT || 3000, () => {
        console.log('the server has started')
    })
}