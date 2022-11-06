/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpError from '@helpers/HttpError';
import { MESSAGES, JWT_KEY } from '@config';
import UserService from '@services/User.service';
import { IUser } from '@interfaces/User.interface';

declare module 'express' {
  // eslint-disable-next-line no-shadow
  export interface Request {
    user?: IUser;
  }
}
// eslint-disable-next-line consistent-return
export const verify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'
        ? req.headers.authorization.split(' ')[1]
        : null;

    if (!token) {
      throw new httpError(MESSAGES.UNAUTHORIZED, 401);
    }
    const decoded = <string>(<unknown>jwt.verify(token, <string>JWT_KEY));
    const user = await UserService.findOne(parseInt(decoded, 10));

    if (!user) {
      throw new httpError(MESSAGES.UNAUTHORIZED, 401);
    }

    req.user = user;
    return next();
  } catch (error) {
    next(error);
  }
};
