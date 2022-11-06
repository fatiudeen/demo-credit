/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger';
import httpResponse from '@helpers/HttpResponse';
// import Service from '@services/service';
import httpError from '@helpers/HttpError';
import { IUser } from '@interfaces/User.interface';
import { IWallet } from '@interfaces/Wallet.interface';
import { IService } from '@interfaces/service.alias';
// import UserService from '@services/User.service';
// import WalletService from '@services/Wallet.service';

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

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const data = <T>req.body;
      // const result = await this.service.create(data);
      // this.HttpResponse.send(res, result);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
  // get = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     // const result = await this.service.find();
  //     // this.HttpResponse.send(res, result);
  //   } catch (error) {
  //     logger.error(error);
  //     next(error);
  //   }
  // };

  // getOne = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     // const result = await this.service.findOne(req.params[this.resourceId]);
  //     // if (!result) throw new this.HttpError(`${this.resource} not found`, 404);
  //     // this.HttpResponse.send(res, result);
  //   } catch (error) {
  //     logger.error(error);
  //     next(error);
  //   }
  // };

  // update = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     // const result = await this.service.update(req.params[this.resourceId], req.body);
  //     // if (!result) throw new this.HttpError(`${this.resource} not found`, 404);
  //     // this.HttpResponse.send(res, { result });
  //   } catch (error) {
  //     logger.error(error);
  //     next(error);
  //   }
  // };

  // delete = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     // const result = await this.service.update(req.params[this.resourceId], req.body);
  //     // if (!result) throw new this.HttpError(`${this.resource} not found`, 404);
  //     // this.HttpResponse.send(res, { result });
  //   } catch (error) {
  //     logger.error(error);
  //     next(error);
  //   }
  // };

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
