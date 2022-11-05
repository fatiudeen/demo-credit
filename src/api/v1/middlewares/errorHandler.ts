/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import HttpError from '@helpers/HttpError';

const httpErrorHandler = (
  err: HttpError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = { ...err };
  error.message = err.message;

  let statusCode: number;
  if ('statusCode' in error) {
    statusCode = error.statusCode;
  } else {
    statusCode = 500;
  }
  error.message = error.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    error,
  });
};

export { httpErrorHandler };
