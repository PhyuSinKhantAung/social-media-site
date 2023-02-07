const ApiError = require('./apiError');

class NotFoundError extends ApiError {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = NotFoundError;
