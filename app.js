const express = require('express')
const app = express()

const moviesRoute = require('./Routes/movieRoute')


app.use(express.json())
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString()
    next()
})

app.use('/api/v1/movies', moviesRoute)

module.exports = app