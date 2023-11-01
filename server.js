const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const app = require('./app')
const mongoose = require('mongoose')


mongoose.connect(process.env.CONN_STR, { useNewUrlParser: true })
    .then(connection => console.log("DB connection Successful"))

const server = app.listen(process.env.PORT || 3000, () => {
    console.log('the server has started...')
})


process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message)
    console.log('Unhandled rejection occured!\nShutting down ...')
    server.close(() => { process.exit(1) })
})


