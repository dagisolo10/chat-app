const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;
        console.error(err);

        if (error.name === "CastError") {
            const message = `Resource not found with id: ${error.value}`;
            error = new Error(message);
            error.statusCode = 404;
        }
        if (error.code === 11000) {
            const message = `Duplicate ${Object.keys(error.keyValue)} entered`;
            error = new Error(message);
            error.statusCode = 400;
        }
        if (error.name === "JsonWebTokenError") {
            const message = "Invalid token";
        }
        if (error.name === "TokenExpiredError") {
            const message = "Token expired";
            error = new Error(message);
            error.statusCode = 401;
        }
        if (error.name === "ValidationError") {
            const message = Object.values(error.errors).map((val) => val.message);
            error = new Error(message.join(", "));
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = errorMiddleware;
