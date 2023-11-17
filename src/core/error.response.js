const reasonPhrases = require('./reasonPhrases');
const statusCodes = require('./statusCodes');

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = reasonPhrases.CONFLICT,
    statusCode = statusCodes.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = reasonPhrases.BAD_REQUEST,
    statusCode = statusCodes.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
};
