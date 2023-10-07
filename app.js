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
    console.log(parseInt(req.params['id']))
    
    movies.map((item) => {
        if (item.id === parseInt(req.params['id']))
        res.status(200).json({
            status: 'success!',
            data: item
        })
        else res.status(404).json({
            status: 'not found',
            data: 'not existing'
        })
    })    


})

// POST - api/movies
app.post('/api/v1/movies', (req, res) => {
    console.log(req.body)

    const newId = movies[movies.length - 1].id + 1

    const newMovie = Object.assign({id: newId}, req.body)
    
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