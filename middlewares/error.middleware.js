const errorMiddleware = (err, req, res, next) => {
    try {
        // Do not shadow the parameter; clone into a differently named variable
        let error = { ...err };

        // Preserve the original message if present
        error.message = err?.message || error.message;

        console.log(error);

        // Mongoose bad ObjectId
        if (error.name === "CastError") {
            const message = `Resource not found with id of ${error.value}`;
            error = new Error(message);
            error.statusCode = 404;
        }

        // Mongoose duplicate key
        if (error.code === 11000) {
            const message = "Duplicate field value entered";
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose validation error
        if (error.name === "ValidationError") {
            const message = Object.values(error.errors || {}).map((val) => val.message).join(", ");
            error = new Error(message);
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Server Error",
        });
    } catch (caught) {
        next(caught);
    }
};

export default errorMiddleware;