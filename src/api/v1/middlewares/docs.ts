/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import { DOCS } from '@config';

export const docs = (req: Request, res: Response) => {
  res.redirect(<string>DOCS);
};
