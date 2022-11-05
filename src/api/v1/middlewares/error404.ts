/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';

export const error404 = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not Found',
  });
};
