const customAPIError = require('./custom-api');
const { StatusCodes } = require('http-status-codes');

class NotFoundError extends customAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
