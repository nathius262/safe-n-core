import { error_response } from "../utils/response_formatter.js";

export const not_found_handler = (req, res) => {
    return error_response(res, {
        status_code: 404,
        message: "Route not found",
        error_code: "NOT_FOUND",
        details: {
            method: req.method,
            path: req.originalUrl
        }
    });
};

export const error_handler = (err, req, res, next) => {
    console.error(err);

    return error_response(res, {
        status_code: err.status_code || 500,
        message: err.message || "Something went wrong",
        error_code: err.code || "INTERNAL_ERROR",
        details: err.details || null
    });
};
