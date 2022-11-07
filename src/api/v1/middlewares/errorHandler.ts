import { Request, Response, NextFunction } from 'express';
import HttpError from '@helpers/HttpError';
import { MESSAGES } from '@config';

const httpErrorHandler = (
  err: HttpError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = { ...err };
  error.message = err.message;
  let message;

  let statusCode: number;
  if ('statusCode' in error) {
    statusCode = error.statusCode;
  } else if ('errno' in error) {
    statusCode = 500;
    message = MESSAGES.DB_ERROR;
  } else {
    statusCode = 500;
  }

  if (!message && statusCode > 399 && statusCode < 500) {
    message = MESSAGES.BAD_REQUEST_ERROR;
  } else message = message || MESSAGES.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message,
    error: (<any>error).data || error.message,
  });
};

export { httpErrorHandler };
