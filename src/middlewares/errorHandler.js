const { NODE_ENV } = require('../constant');

const errorHandler = (err, req, res, next) => {
  const customError = {
    code: err.statusCode || 500,
    message: err.message || 'Something went wrong!',
  };
  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.code = 400;
  }
  if (err.name === 'CastError') {
    customError.message = `No item found with id : ${err.value}`;
    customError.code = 404;
  }
  if (NODE_ENV === 'development') {
    return res.status(customError.code).json({
      code: customError.code,
      message: customError.message,
      stack: err.stack,
    });
  }

  if (NODE_ENV === 'production') {
    return res.status(customError.code).json({
      code: customError.code,
      message: customError.message,
    });
  }
};

module.exports = errorHandler;
