const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const app = require('./app')
const mongoose = require('mongoose')


mongoose.connect(process.env.CONN_STR)
.then(connection => console.log("DB connection Successful"))
.catch((error) => console.log("not working because of this error: " + error))


if (process.env.NODE_ENV === 'development') {
    app.listen(process.env.PORT || 3000, () => {
        console.log('the server has started')
    })
}