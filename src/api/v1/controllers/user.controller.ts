import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger';
import Controller from '@controllers/controller';
import { IUser } from '@interfaces/User.interface';
import UserService from '@services/User.service';
import { MESSAGES } from '@config';

class UserController extends Controller<IUser> {
  protected service = UserService;

  login = async (
    req: Request<never, any, Record<'username' | 'password', string>>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { username, password } = req.body;
      const user = await this.service.findOne({ username });
      if (!user) throw new this.HttpError(MESSAGES.INVALID_CREDENTIALS, 400);

      const verifyPassword = await user.compare(password);
      if (!verifyPassword) throw new this.HttpError(MESSAGES.INVALID_CREDENTIALS, 400);

      const token = user.generateToken();
      const result = { user, token };
      this.HttpResponse.send(res, result);
    } catch (error) {
      logger.error([error]);
      next(error);
    }
  };

  signup = async (req: Request<never, any, IUser>, res: Response, next: NextFunction) => {
    try {
      const { username } = req.body;

      const user = await this.service.findOne({ username });
      if (user) throw new this.HttpError(MESSAGES.USER_EXISTS, 400);

      const result = await this.service.create(req.body);

      this.HttpResponse.send(res, result);
    } catch (error) {
      logger.error([error]);
      next(error);
    }
  };

  getUser = async (
    req: Request<{ userId: string }, any, never>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = await this.service.findOne(parseInt(req.params.userId, 10));
      if (!user) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

      const userWithWallet = await user.myWallet();
      const result: any = { ...userWithWallet };
      delete result.wallet.history;

      this.HttpResponse.send(res, result);
    } catch (error) {
      logger.error([error]);
      next(error);
    }
  };

  getMe = async (req: Request<never, any, never>, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw MESSAGES.USER_DOES_NOT_EXISTS;

      // const user = await this.service.findOne(16);
      const user = await this.service.findOne(<number>req.user.id);
      if (!user) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

      const userWithWallet = await user.myWallet();
      const result: any = { ...userWithWallet };
      delete result.wallet.history;

      this.HttpResponse.send(res, result);
    } catch (error) {
      logger.error([error]);
      next(error);
    }
  };

  getAll = async (req: Request<never, any, never>, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.find();

      this.HttpResponse.send(res, result);
    } catch (error) {
      logger.error([error]);
      next(error);
    }
  };
}

export default new UserController(UserService, 'claim');
