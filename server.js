const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const app = require('./app')

console.log(process.env)

if (process.env.NODE_ENV === 'development')
app.listen(process.env.PORT || 3000, () => {
    console.log('the server has started')
})