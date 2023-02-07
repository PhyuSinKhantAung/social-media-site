const ApiError = require('./apiError');

class BadRequestError extends ApiError {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = BadRequestError;
