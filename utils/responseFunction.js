const response = (res, status, message, data = null, success = true) => {
    return res.status(status).json({
        success,
        message,
        data,
    });
};


export default response;