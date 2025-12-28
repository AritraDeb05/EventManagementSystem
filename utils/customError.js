export class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name; // Set error name to CustomError
    Error.captureStackTrace(this, this.constructor);
  }
}
