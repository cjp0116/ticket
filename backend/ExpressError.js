class ExpressError extends Error {
  constructor(msg, statusCode, errors = null) {
    super()
    this.statusCode = statusCode;
    this.msg = msg;
    this.errors = errors;
    console.log(this.stack);
  };
};

module.exports = ExpressError;