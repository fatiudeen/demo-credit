/* eslint-disable no-unused-vars */
import { Request } from 'express';
import { IUser } from '@interfaces/User.interface';

declare module 'express' {
  // eslint-disable-next-line no-shadow
  export interface Request {
    user?: IUser;
  }
}
