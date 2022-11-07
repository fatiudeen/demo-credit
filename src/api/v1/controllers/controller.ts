import { Request, Response, NextFunction } from 'express';
import httpResponse from '@helpers/HttpResponse';
import httpError from '@helpers/HttpError';
import { IUser } from '@interfaces/User.interface';
import { IWallet } from '@interfaces/Wallet.interface';
import { IService } from '@interfaces/service.alias';
import { logger } from '@utils/logger';

export default abstract class Controller<T extends IUser | IWallet> {
  protected service;
  protected HttpError = httpError;
  protected HttpResponse = httpResponse;
  constructor(service: IService) {
    this.service = service;
  }

  static Controller() {
    return (target: Object, value: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;
      descriptor.value = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await originalMethod.call(target.constructor(), req);
          let status = 200;
          if (req.method === 'POST') {
            status = 201;
          }
          httpResponse.send(res, result, status);
        } catch (error) {
          // logger.error([error]);
          next(error);
        }
      };
    };
  }
}
