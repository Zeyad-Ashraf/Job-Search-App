

export const asyncHandler = (fn) => (req, res, next) => {
    fn(req, res, next).catch((err) => {
        return next(err);
    })
}

export const globalErrorHandler = (err, req, res, next) => {
    return res.status(err["cause"] || 500).json({msg: err.message ,stack: err.stack});
}


