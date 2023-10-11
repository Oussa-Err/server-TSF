const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const app = require('./app')
const mongoose = require('mongoose')


mongoose.connect(process.env.LOCAL_CONN_STR, {
    useNewUrlParser: true
}).then((connection) => {
    console.log(connection)
    console.log("DB connection Successful")
}).catch((error) => {
    console.log(error)
    console.log("not working")
})

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

const movie = mongoose.model('Movie', movieSchema)

if (process.env.NODE_ENV === 'development') {
    app.listen(process.env.PORT || 3000, () => {
        console.log('the server has started')
    })
}