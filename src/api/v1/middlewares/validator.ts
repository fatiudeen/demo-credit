import { ValidationChain, validationResult, matchedData } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import HttpError from '@helpers/HttpError';

function checkIfExtraFields(req: Request) {
  const allowedFields = Object.keys(matchedData(req)).sort();

  // Check for all common request inputs
  const requestInput = { ...req.query, ...req.params, ...req.body };
  const requestFields = Object.keys(requestInput).sort();

  if (JSON.stringify(allowedFields) === JSON.stringify(requestFields)) {
    return false;
  }
  return true;
}

export default (dtos: ValidationChain[], allowExtraFields = false) => [
  ...dtos,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = errors.array();
      throw new HttpError('user input validation error', 400, error);
    }

    if (!allowExtraFields) {
      // Fields validation
      const extraFields = checkIfExtraFields(req);
      if (extraFields) {
        throw new HttpError('user input validation error', 400, {
          details: 'request contains unspecified input',
        });
      }
    }
    next();
  },
];
