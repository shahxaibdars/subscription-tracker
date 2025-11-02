const errorMiddleware = (err, req, res, next) => {
    try{
        let err = { ...err };

        err.message = err.message;

        console.log(err);

        // Mongoose bad ObjectId
        if (err.name === "CastError") {
            const message = `Resource not found with id of ${err.value}`;
            err = new Error(message);
            err.statusCode = 404;
        }

        // Mongoose duplicate key
        if (err.code === 11000) {
            const message = "Duplicate field value entered";
            err = new Error(message);
            err.statusCode = 400;
        }
        
        // Mongoose validation error
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map((val) => val.message).join(", ");
            err = new Error(message);
            err.statusCode = 400;
        }

        res.status(err.statusCode || 500).json({
            success: false,
            error: err.message || "Server Error"
        });
    }catch(error){
        next(error);
    }
};

export default errorMiddleware;