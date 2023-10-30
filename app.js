const express = require('express')
const morgan = require('morgan')
const app = express()
const CustomError = require('./utils/customError')
const globalErrHandler = require('./Controllers/globalErrorController')
const moviesRoute = require('./Routes/movieRoute')


app.use(express.json())
app.use(morgan('dev'))
// serving static files
app.use(express.static('./public'))




app.use('/api/v1/movies', moviesRoute)

app.all('*', (req, res, next) => {
    const err = new CustomError(`can't find ${req.originalUrl} on the server`, 404)
    next(err)
})
 
app.use(globalErrHandler)

module.exports = app