const dotenv = require('dotenv')
const CustomError = require('../utils/customError')
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

const castError = (error) => {
    const msg = new CustomError(`invalid value for ${error.path}: ${error.value}`, 500)
    return msg
}

const duplicateKeyError = (error) => {
    let msg
    if (error.keyValue.name) msg = new CustomError(`this name already exist: ${error.keyValue.name}`, 400)

    if (error.keyValue.email) msg = new CustomError(`this email already exist: ${error.keyValue.email}`, 400)
    
    return msg
}

const validationError = (error) => {
    const errorMsg = Object.values(error.errors).map(el => el.message)
    const messages = errorMsg.join(". ")
    return new CustomError(messages, 400)
}

const handleJWTError = () => {
    return new CustomError('Invalid token, Please login again', 401)
}

const handleExpiredJWT = () => {
    return new CustomError("you've been absent for a while.\nLog in again", 401)
}



module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    if (process.env.NODE_ENV === 'development') {
        devError(res, err)
    } else if(process.env.NODE_ENV === "production"){
        
        if(err.name === "CastError") err = castError(err)
        
        if(err.code === 11000) err = duplicateKeyError(err)
        
        if(err.name === "ValidationError") err = validationError(err)

        if(err.name === "TokenExpiredError") err = handleExpiredJWT(err)

        if(err.name === "JsonWebTokenError") err = handleJWTError(err)


        prodError(res, err)
    }
}