class ResponseError extends Error {
  constructor(status, message, errorDetails = null) {
    super(message);
    this.status = status;
    this.errorDetails = errorDetails;
  }
}

export { ResponseError };
