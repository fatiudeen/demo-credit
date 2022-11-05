import { IWallet } from '@interfaces/Wallet.interface';
import Repository from '@repositories/repository';

class WalletService extends Repository<IWallet> {
  protected model: 'users' | 'wallets' = 'wallets';

  // async create(data: Partial<IWallet>) {
  //   console.log(JSON.stringify([]));

  //   await this.db<IWallet>(this.model).insert(<any>{
  //     ...data,
  //     history: JSON.stringify(data.history),
  //   });
  //   return this.findOne(data);
  // }
}

export default new WalletService();
