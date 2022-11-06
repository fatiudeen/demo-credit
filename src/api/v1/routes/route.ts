import { Router } from 'express';
import validator from '@middlewares/validator';
import { ValidationChain } from 'express-validator';
import Controller from '@controllers/controller';
import { IUser } from '@interfaces/User.interface';
import { IWallet } from '@interfaces/Wallet.interface';

export default abstract class ClaimsRoute<T extends IUser | IWallet> {
  readonly router;
  abstract controller: Controller<T>;
  abstract dto: Record<string, ValidationChain[]>;
  readonly validator = validator;
  constructor() {
    this.router = Router();
  }

  abstract initRoutes(): Router;
}
