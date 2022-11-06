import { IWallet } from '@interfaces/Wallet.interface';
import Repository from '@repositories/repository';

class WalletService extends Repository<IWallet> {
  protected model: 'users' | 'wallets' = 'wallets';
  async update(_query: number | Partial<IWallet>, data: Partial<IWallet>) {
    const query = this.seralizeId(_query);
    console.log(JSON.stringify(data.history));

    const id = await this.db<IWallet>(this.model)
      .where(query)
      .update(<any>{
        ...data,
        history: JSON.stringify(data.history),
      });
    return this.findOne(id);
  }
}

export default new WalletService();
