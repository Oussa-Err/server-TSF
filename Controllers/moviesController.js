const fs = require('fs')

let movies = JSON.parse(fs.readFileSync('./Data/movies.json'))

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

    const match = movies.find(el => el.id === id)

    if (!match) {
        res.status(404).json({
            status: 'not found',
            data: 'not existing'
        })
    }

    console.log(req.params["id"])
    res.status(200).json({
        status: 'success!',
        data: movies[id - 1]
    })
}


exports.updateMovie = (req, res) => {
    const id = req.params.id * 1
    const movieToUpdate = movies.find(el => el.id === id)
    if (!movieToUpdate) {
        res.status(204).json({
            status: 'No content!'
        })
    }

    const index = movies.indexOf(movieToUpdate)
    const updatedMovie = Object.assign(movieToUpdate, req.body)
    movies[index] = updatedMovie


    fs.writeFile('./Data/movies.json', JSON.stringify(movies), (err) => {
        res.status(200).json({
            status: 'updated!',
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
    console.log(id)
    console.log(movieToDelete)
    if (!movieToDelete) {
        res.status(404).json({
            status: 'Not found!'
        })
    }
    console.log(index)
    console.log(movies)
    movies.splice(index, 1)

    fs.writeFile('./Data/movies.json', JSON.stringify(movies), (err) => {
        res.status(204).json({
            success: 'Deleted!',
            data: {
                movie: null
            }
        })
    })

}



exports.addMovie = (req, res) => {
    console.log(req.body)

    const newId = movies[movies.length - 1].id + 1

    const newMovie = Object.assign({ id: newId }, req.body)

    movies.push(newMovie)

    fs.writeFile('./Data/movies.json', JSON.stringify(movies), (err) => {
        res.status(201).json({
            status: "created!",
            data: {
                movie: newMovie
            }
        })
    })
}
