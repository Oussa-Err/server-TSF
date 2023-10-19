const mongoose = require("mongoose")
const fs = require("fs")
const Movies = require("../Models/moviesModel")
const dotenv = require("dotenv")
dotenv.config({ path: './config.env' })


mongoose.connect(process.env.CONN_STR, { UseNewUrlParser: true })
.then((connection) => {
    console.log("DB connection successful!")
})
.catch((error) => {
    console.log("an Error has occured: " + error)
})

const movies = JSON.parse(fs.readFileSync("Data/movies.json"))

// delete function
const deleteMovies = async () => {
    try {
        await Movies.deleteMany()
        console.log("movies deleted successfully!")
    } catch (err) {
        console.log("error " + err.message)
    }

    process.exit(1)
}



// import function
const importMovies = async () => {
    try {
        await Movies.create(movies)
        console.log("data imported successfully!")
    } catch (err) {
        console.log("error: " + err)
    }

    process.exit(1)
}

console.log(process.argv)

if (process.argv[2] === "--delete") {
    deleteMovies()
}

if (process.argv[2] === '--import') {
    importMovies()
}