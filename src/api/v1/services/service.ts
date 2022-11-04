// single model methods
import { IUser } from '@interfaces/User.interface';
import { IWallet } from '@interfaces/Wallet.interface';
import Repository from '@repositories/repository';

export default abstract class Service<T extends IUser | IWallet> {
  protected abstract model: 'users' | 'wallets';
  protected abstract repository: Repository<T>;
}
