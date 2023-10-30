const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const app = require('./app')
const mongoose = require('mongoose')


mongoose.connect(process.env.CONN_STR, {useNewUrlParser: true})
.then(connection => console.log("DB connection Successful"))



if (process.env.NODE_ENV === 'development') {
    app.listen(process.env.PORT || 3000, () => {
        console.log('the server has started...')
    })
}