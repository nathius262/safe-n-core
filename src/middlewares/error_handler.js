export const not_found_handler = (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Route ${req.originalUrl} not found`,
    });
};

export const error_handler = (err, req, res, next) => {
    console.error(err);

    const status_code = err.status_code || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status_code).json({
        status: 'error',
        message,
        errors: err.errors || null,
    });
};
