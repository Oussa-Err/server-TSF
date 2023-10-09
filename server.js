const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const app = require('./app')


if (process.env.NODE_ENV === 'development')
app.listen(process.env.PORT || 3000, () => {
    console.log('the server has started')
})