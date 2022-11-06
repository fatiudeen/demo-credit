import { Request } from 'express';
import WalletService from '@services/Wallet.service';
import Controller from '@controllers/controller';
import { IWallet } from '@interfaces/Wallet.interface';
import { MESSAGES } from '@config';

class RequestController extends Controller<IWallet> {
  protected service = WalletService;

  @Controller.Controller()
  async fund(req: Request<never, any, Record<'amount', string>>) {
    if (!req.user) throw MESSAGES.USER_DOES_NOT_EXISTS;
    const user = await WalletService.findOwner(<number>req.user.id);
    if (!user) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

    const wallet = await this.service.findOne(user.wallet);
    if (!wallet) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

    const result = wallet.fund(parseInt(req.body.amount, 10));
    await wallet.save();

    if (!result.success) {
      throw new this.HttpError(result.desc, 400, result);
    }
    return result;
  }

  @Controller.Controller()
  async transfer(req: Request<never, any, Record<'amount' | 'userId', string>>) {
    if (!req.user) throw MESSAGES.USER_DOES_NOT_EXISTS;
    const user = await WalletService.findOwner(<number>req.user.id);
    if (!user) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

    const wallet = await this.service.findOne(user.wallet);
    if (!wallet) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

    const result = await wallet.transfer(
      parseInt(req.body.amount, 10),
      parseInt(req.body.userId, 10),
      user.fullname,
    );
    await wallet.save();

    if (!result.success) {
      throw new this.HttpError(result.desc, 400, result);
    }

    return result;
  }

  @Controller.Controller()
  async withdraw(
    req: Request<never, any, Record<'amount' | 'accountNumber' | 'accountName', string>>,
  ) {
    if (!req.user) throw MESSAGES.USER_DOES_NOT_EXISTS;
    const user = await WalletService.findOwner(<number>req.user.id);
    if (!user) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

    const wallet = await this.service.findOne(user.wallet);
    if (!wallet) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

    const result = wallet.withdraw(
      parseInt(req.body.amount, 10),
      parseInt(req.body.accountNumber, 10),
      req.body.accountName,
    );
    await wallet.save();

    if (!result.success) {
      throw new this.HttpError(result.desc, 400, result);
    }

    return result;
  }

  @Controller.Controller()
  async getTxnHistory(req: Request<never, any, never>) {
    if (!req.user) throw MESSAGES.USER_DOES_NOT_EXISTS;
    const user = await this.service.findOwner(<number>req.user.id);
    if (!user) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

    const result = await user.myHistory();

    return result;
  }
}

export default new RequestController(WalletService);
