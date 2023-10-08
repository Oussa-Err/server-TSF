const app = require('./app')

app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString()
    next()
})

const port = 3000
app.listen(process.env.PORT || port, () => {
    console.log('the server has started')
})