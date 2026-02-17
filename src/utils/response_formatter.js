export const success_response = (res, data = {}, message = 'Success', status_code = 200) => {
    return res.status(status_code).json({
        status: 'success',
        message,
        data,
    });
};

export const error_response = (res, error = {}, message = 'Error', status_code = 400) => {
    return res.status(status_code).json({
        status: 'error',
        message,
        errors: error,
    });
};
