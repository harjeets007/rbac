module.exports = {
  success: (statusCode = 200, message, data, res) => {
    const successResponse = {
      status: "success",
      success: true,
      statusCode,
      message,
      data,
    };
    res.status(successResponse?.statusCode).json(successResponse);
  },

  error: (statusCode = 400, message, errors = null, res) => {
    const errorResponse = {
      status: "fail",
      success: false,
      statusCode,
      message,
      errors,
    };
    res.status(errorResponse?.statusCode).json(errorResponse);
  },
};
