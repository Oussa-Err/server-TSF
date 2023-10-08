const express = require('express')
const app = express()
const moviesRoute = require('./Routes/movieRoute')


const port = 3000

app.use(express.json())
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString()
    next()
})

app.use('/api/v1/movies', moviesRoute)

app.listen(process.env.PORT || port, () => {
    console.log('the server has started')
})