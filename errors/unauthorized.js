const customAPIError = require('./custom-api');
const { StatusCodes } = require('http-status-codes');

class UnauthorizedError extends customAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = UnauthorizedError;
