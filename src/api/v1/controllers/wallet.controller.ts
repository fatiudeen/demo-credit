/* eslint-disable indent */
import { Request, Response, NextFunction } from 'express';
import WalletService from '@services/Wallet.service';
import Controller from '@controllers/controller';
import { IWallet } from '@interfaces/Wallet.interface';
import { MESSAGES } from '@config';
import { logger } from '@utils/logger';

class RequestController extends Controller<IWallet> {
  protected service = WalletService;

  fund = async (
    req: Request<never, any, Record<'amount', string>>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) throw MESSAGES.USER_DOES_NOT_EXISTS;
      const user = await WalletService.findOwner(<number>req.user.id);
      if (!user) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

      const wallet = await this.service.findOne(user.wallet);
      if (!wallet) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

      const result = wallet.fund(parseInt(req.body.amount, 10));
      const x = await wallet.save();
      console.log(x);

      if (!result.success) {
        throw new this.HttpError(result.desc, 400, result);
      }

      this.HttpResponse.send(res, result);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  transfer = async (
    req: Request<never, any, Record<'amount' | 'userId', string>>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) throw MESSAGES.USER_DOES_NOT_EXISTS;
      const user = await WalletService.findOwner(<number>req.user.id);
      if (!user) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

      const wallet = await this.service.findOne(user.wallet);
      if (!wallet) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

      const result = await wallet.transfer(
        parseInt(req.body.amount, 10),
        parseInt(req.body.userId, 10),
      );
      await wallet.save();

      if (!result.success) {
        throw new this.HttpError(result.desc, 400, result);
      }

      this.HttpResponse.send(res, result);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  withdraw = async (
    req: Request<never, any, Record<'amount' | 'accountNumber' | 'accountName', string>>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) throw MESSAGES.USER_DOES_NOT_EXISTS;
      const user = await WalletService.findOwner(<number>req.user.id);
      if (!user) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

      const wallet = await this.service.findOne(user.wallet);
      if (!wallet) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

      const result = await wallet.withdraw(
        parseInt(req.body.amount, 10),
        parseInt(req.body.accountNumber, 10),
        req.body.accountName,
      );
      await wallet.save();

      if (!result.success) {
        throw new this.HttpError(result.desc, 400, result);
      }

      this.HttpResponse.send(res, result);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
  getTxnHistory = async (req: Request<never, any, never>, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw MESSAGES.USER_DOES_NOT_EXISTS;
      const user = await this.service.findOwner(<number>req.user.id);
      if (!user) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

      const result = await user.myHistory();

      this.HttpResponse.send(res, result);
    } catch (error) {
      logger.error([error]);
      next(error);
    }
  };
}

export default new RequestController(WalletService, 'wallet');
