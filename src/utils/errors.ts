import { StatusCodes } from 'http-status-codes';

export class HttpError extends Error {
  constructor(statusCode: StatusCodes, message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = 'Bad Request') {
    super(StatusCodes.BAD_REQUEST, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Not Found') {
    super(StatusCodes.NOT_FOUND, message);
  }
}

export class UnauthorizedException extends HttpError {
  constructor(message: string = 'Unauthorized') {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}

export class ForbiddenException extends HttpError {
  constructor(message: string = 'Forbidden') {
    super(StatusCodes.FORBIDDEN, message);
  }
}
