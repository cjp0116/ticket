class ExpressError extends Error {
  constructor(msg, statusCode) {
    super()
    this.statusCode = statusCode;
    this.msg = msg;
    console.log(this.stack);
  };
};

module.exports = ExpressError;