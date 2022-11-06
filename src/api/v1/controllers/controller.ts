import { Request, Response, NextFunction } from 'express';
import httpResponse from '@helpers/HttpResponse';
import httpError from '@helpers/HttpError';
import { IUser } from '@interfaces/User.interface';
import { IWallet } from '@interfaces/Wallet.interface';
import { IService } from '@interfaces/service.alias';

export default abstract class Controller<T extends IUser | IWallet> {
  protected service;
  protected HttpError = httpError;
  protected HttpResponse = httpResponse;
  private resource;
  private resourceId;
  constructor(service: IService, resource: string) {
    this.service = service;
    this.resource = resource;
    this.resourceId = `${resource}Id`;
  }

  static Controller() {
    return (target: Object, value: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;
      // eslint-disable-next-line func-names
      // descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      //   try {
      //     const result = await originalMethod(req);
      //     httpResponse.send(res, result);
      //   } catch (error) {
      //     next(error);
      //   }
      // };
      descriptor.value = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await originalMethod(req);
          httpResponse.send(res, result);
        } catch (error) {
          next(error);
        }
      };
      // return descriptor;
    };
  }
}
