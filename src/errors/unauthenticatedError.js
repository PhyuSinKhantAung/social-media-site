const ApiError = require('./apiError');

class UnauthenticatedError extends ApiError {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = UnauthenticatedError;
