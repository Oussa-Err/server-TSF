const fs = require('fs')

let movies = JSON.parse(fs.readFileSync('./Data/movies.json'))


exports.checkID = (req, res, next, value) => {
    console.log('the id is ' + value)

    let movie = movies.find(el => el.id === parseInt(value))

    if (!movie) {
        return res.status(404).json({
            status: "fail!",
            message: "the movie whit ID " +value+ " is not found"
        })
    }

    next()
}

exports.validateBody = (req, res, next) => {
    if (!req.body.name || !req.body.releaseYear) {
        return res.status(404).json({
            status: "fail!",
            message: "the request body is undefined"
        })
    }

    next()
}

exports.getAllMovies = (req, res) => {
    res.status(200).json({
        status: "success!",
        requestedAt: req.requestedAt,
        count: movies.length,
        data: {
            movies: movies
        }
    })
}

exports.getMovie = (req, res) => {
    let id = parseInt(req.params['id'])

    res.status(200).json({
        status: 'success!',
        requestedAt: req.requestedAt,
        data: movies[id - 1]
    })
}

exports.updateMovie = (req, res) => {
    const id = req.params.id * 1
    const movieToUpdate = movies.find(el => el.id === id)

    const index = movies.indexOf(movieToUpdate)
    const updatedMovie = Object.assign(movieToUpdate, req.body)
    movies[index] = updatedMovie


    fs.writeFile('./Data/movies.json', JSON.stringify(movies), (err) => {
        res.status(200).json({
            status: 'updated!',
            requestedAt: req.requestedAt,
            data: {
                movie: updatedMovie
            }
        })
    })

}

exports.deleteMovie = (req, res) => {
    const id = req.params.id * 1
    const movieToDelete = movies.find(el => el.id === id)
    const index = movies.indexOf(movieToDelete)

    movies.splice(index, 1)

    fs.writeFile('./Data/movies.json', JSON.stringify(movies), (err) => {
        res.status(204).json({
            success: 'Deleted!',
            requestedAt: req.requestedAt,
            data: {
                movie: null
            }
        })
    })

}

exports.addMovie = (req, res) => {
    const newId = movies[movies.length - 1].id + 1
    const newMovie = Object.assign({ id: newId }, req.body)
    movies.push(newMovie)

    fs.writeFile('./Data/movies.json', JSON.stringify(movies), (err) => {
        res.status(201).json({
            status: "created!",
            requestedAt: req.requestedAt,
            data: {
                movie: newMovie
            }
        })
    })
}
