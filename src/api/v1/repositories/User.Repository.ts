import Reopsitory from '@repositories/repository';
import { IUser } from '@interfaces/User.interface';

class UserReopsitory extends Reopsitory<IUser> {
  protected model: 'users' | 'wallets' = 'users';
}

export default new UserReopsitory();
