import { Request } from 'express';
import Controller from '@controllers/controller';
import { IUser } from '@interfaces/User.interface';
import UserService from '@services/User.service';
import { MESSAGES } from '@config';

class UserController extends Controller<IUser> {
  protected service = UserService;

  @Controller.Controller()
  async login(req: Request<never, any, Record<'username' | 'password', string>>) {
    const { username, password } = req.body;
    const user = await this.service.findOne({ username });
    if (!user) throw new this.HttpError(MESSAGES.INVALID_CREDENTIALS, 400);

    const verifyPassword = await user.compare(password);
    if (!verifyPassword) throw new this.HttpError(MESSAGES.INVALID_CREDENTIALS, 400);

    const token = user.generateToken();
    const result = { user, token };
    return result;
  }

  @Controller.Controller()
  async signup(req: Request<never, any, IUser>) {
    const { username } = req.body;
    const user = await this.service.findOne({ username });
    if (user) throw new this.HttpError(MESSAGES.USER_EXISTS, 400);

    const result = await this.service.create(req.body);
    return result;
  }

  @Controller.Controller()
  async getUser(req: Request<{ userId: string }, any, never>) {
    const user = await this.service.findOne(parseInt(req.params.userId, 10));
    if (!user) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

    const userWithWallet = await user.myWallet();
    const result: any = { ...userWithWallet };
    delete result.wallet.history;
    return result;
  }

  @Controller.Controller()
  async getMe(req: Request<never, any, never>) {
    if (!req.user) throw MESSAGES.USER_DOES_NOT_EXISTS;

    const user = await this.service.findOne(<number>req.user.id);
    if (!user) throw new this.HttpError(MESSAGES.INVALID_RECORD, 400);

    const userWithWallet = await user.myWallet();
    const result: any = { ...userWithWallet };
    delete result.wallet.history;

    return result;
  }

  @Controller.Controller()
  async getAll(req: Request<never, any, never>) {
    const result = await this.service.find();
    return result;
  }
}

export default new UserController(UserService);
