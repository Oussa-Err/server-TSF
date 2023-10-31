class CustomError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.status = statusCode >= 400 && statusCode <= 500 ? "fail" : "error"
        this.isOperational = true

        console.log("custom error class executed")

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError