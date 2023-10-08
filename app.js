const e = require('express')
const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000


let movies = JSON.parse(fs.readFileSync('./Data/movies.json'))

// GET - api/movies
const getAllMovies =  (req, res) => {
    res.status(200).json({
        status: "success!",
        count: movies.length,
        data: {
            movies: movies
        }
    })
}
app.get('/api/v1/movies', getAllMovies)

// GET - api/movies/:{query-params}
app.get('/api/v1/movies/:id', (req, res) => {
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
})

// PATCH - api/movies/:id
app.patch('/api/v1/movies/:id', (req, res) => {
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

})

// DELETE - api/v1/movies/:id
app.delete('/api/v1/movies/:id', (req, res) => {
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

})



// POST - api/v1/movies
app.post('/api/v1/movies', (req, res) => {
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
})


app.listen(process.env.PORT || port, () => {
    console.log('the server has started')
})