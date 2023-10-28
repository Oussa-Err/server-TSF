const express = require('express')
const morgan = require('morgan')
const app = express()

const moviesRoute = require('./Routes/movieRoute')


app.use(express.json())
app.use(morgan('dev'))
// serving static files
app.use(express.static('./public'))

app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString()
    next()
})


app.use('/api/v1/movies', moviesRoute)

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail!',
    //     message: `the ${req.originalUrl} does not exist`
    // })

    const err = new Error(`can't find ${req.originalUrl} on the server`)
    console.log(err.stack)
    err.status = "fail"
    err.statusCode = 404
    next(err)
})
 
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
    next()
})

module.exports = app