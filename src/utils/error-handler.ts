import { HttpError, NotFoundError } from './http-errors';
import { Logger } from './logger';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import { StatusCodes } from 'http-status-codes';
import config from '../config/env.config';

export class ErrorHandler {
  private static logger = new Logger('ErrorHandler');

  public static handle(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (err instanceof HttpError) {
      return res
        .status((err as any).statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          status: 'error',
          method: req.method,
          message: err.message,
          path: config.env ? req.path : undefined,
          stack: config.env === 'development' ? err.stack : undefined,
        });
    }

    if (err instanceof ValidationError) {
      const validationErrors = err.details.map((detail) => detail.message);
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: 'fail',
        method: req.method,
        message: 'Validation Error',
        path: config.env ? req.path : undefined,
        details: validationErrors,
      });
    }
    ErrorHandler.logger.error(err.message);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
}
