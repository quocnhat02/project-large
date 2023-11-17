const statusCodes = require('./statusCodes');
const reasonPhrases = require('./reasonPhrases');

class SuccessResponse {
  constructor({
    message,
    statusCode = statusCodes.OK,
    reasonStatusCode = reasonPhrases.OK,
    metadata = {},
  }) {
    this.message = message || reasonStatusCode;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata = {} }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = statusCodes.CREATED,
    reasonStatusCode = reasonPhrases.CREATED,
    metadata = {},
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
  }
}

module.exports = {
  OK,
  CREATED,
};
