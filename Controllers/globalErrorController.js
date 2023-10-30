const dotenv = require('dotenv')
dotenv.config({ path: './../config.env' })

const devError = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stackTrace: err.stack,
        error: err
    })
}

const prodError = (res, err) => {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }else{
        res.status(500).json({
            status: "error",
            message: "error unknown, try again later"
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    if (process.env.NODE_ENV === 'development') {
        devError(res, err)
    } else if(process.env.NODE_ENV === "production"){
        prodError(res, err)
    }
}