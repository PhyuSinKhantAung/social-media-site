const { NODE_ENV } = require('../constant');

const errorHandler = (error, req, res, next) => {
  const { code = 500, message = 'Server Error', stack } = error;
  // console.error(stack);
  // console.log(error);,

  if (NODE_ENV === 'development') {
    return res.status(code).json({
      code,
      message,
      stack,
    });
  }

  if (NODE_ENV === 'production') {
    return res.status(code).json({
      code,
      message,
    });
  }
};

module.exports = errorHandler;
