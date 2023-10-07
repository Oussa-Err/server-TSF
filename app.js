const e = require('express')
const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000


let movies = JSON.parse(fs.readFileSync('./Data/movies.json'))

// GET - api/movies
app.get('/api/v1/movies', (req, res) => {
    res.status(200).json({
        status: "success!",
        count: movies.length,
        data: {
            movies: movies
        }
    })
})

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
        data: movies[id-1]
    })
})

// PATCH - api/movies/:id
app.patch('/api/v1/movies/:id', (req, res) => {
    const id = req.params["id"] * 1
    const movieToUpdate = movies.find(el => el.id === id)
    const index = movies.indexOf(movieToUpdate)

    Object.assign(movieToUpdate, req.body)

    movies[index] = movieToUpdate

    fs.writeFile('./Data/movies.json', JSON.stringify(movies), (err, data) => {
        res.status(200).json({
            status: 'modified!',
            data: {
                movie: movieToUpdate
            }
        }) 
    })

})



// POST - api/movies
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