const express = require('express')
const app = express()
const port = 3000

// GET - api/movies
app.get('/api/v1/movies', (req, res) => {

})

app.post('/api/v1/movies', (req, res) => {
    
})


app.listen(process.env.PORT || port, () => {
    console.log('the server has started')
})