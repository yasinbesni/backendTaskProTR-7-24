class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static BadRequest(message) {
    return new ApiError(400, message);
  }

  static Unauthorized(message) {
    return new ApiError(401, message);
  }

  static Forbidden(message) {
    return new ApiError(403, message);
  }

  static NotFound(message) {
    return new ApiError(404, message);
  }

  static Conflict(message) {
    return new ApiError(409, message);
  }

  static InternalServerError(message) {
    return new ApiError(500, message);
  }
}

export default ApiError;
