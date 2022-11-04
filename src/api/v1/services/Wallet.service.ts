import Service from '@services/service';
import { IWallet, Transactions, OmitNever } from '@interfaces/Wallet.interface';
import WalletRepository from '@repositories/Wallet.Repository';
import UserService from '@services/User.service';
import { MESSAGES } from '@config';

class WalletService extends Service<IWallet> implements IWallet {
  protected repository = WalletRepository;
  protected model: 'wallets' | 'wallets' = 'wallets';
  public id;
  public balance;
  public history;

  constructor(wallet: IWallet) {
    super();
    this.id = wallet.id || null;
    this.balance = wallet.balance;
    this.history = wallet.history || [];
  }

  private set topUp(amount: number) {
    this.balance += amount;
  }

  private set deduct(amount: number) {
    this.balance -= amount;
  }

  private get uniqueId() {
    return `tsf_${Date.now()}`;
  }

  public fund(amount: number) {
    this.deduct = amount;
    const transaction: OmitNever<Transactions<'credit'>> = {
      id: this.uniqueId,
      success: true,
      type: 'credit',
      amount,
      date: new Date().toUTCString(),
      balance: this.balance,
      from: MESSAGES.DEMO_WALLET,
      desc: MESSAGES.FUNDED,
    };
    this.history.push(transaction);
    return transaction;
  }
  public async transfer(amount: number, userId: string) {
    const transaction: OmitNever<Transactions<'debit'>> = {
      id: this.uniqueId,
      success: true,
      type: 'debit',
      amount,
      date: new Date().toUTCString(),
      balance: this.balance,
      to: '',
      desc: MESSAGES.TRANSFERED,
    };

    const user = await UserService.findOne(userId);
    if (!user) {
      this.history.push(transaction);
      return { ...transaction, success: false, desc: MESSAGES.RECIEVER_DOES_NOT_EXISTS };
    }
    transaction.to = user.fullname;

    if (this.balance < amount) {
      this.history.push(transaction);
      return { ...transaction, success: false, desc: MESSAGES.INSUFFICENT_BALANCE };
    }
    const recieverWallet = await WalletService.findOne(user.wallet);

    this.deduct = amount;
    recieverWallet!.topUp = amount;

    this.history.push(transaction);
    return transaction;
  }
  public withdraw(amount: number, accountNumber: number, accountName: string) {
    const transaction: OmitNever<Transactions<'debit'>> = {
      id: this.uniqueId,
      success: true,
      type: 'debit',
      amount,
      date: new Date().toUTCString(),
      balance: this.balance,
      to: accountName,
      desc: `withdrawal to ${accountNumber}`,
    };

    if (this.balance < amount) {
      this.history.push(transaction);
      return { ...transaction, success: false, desc: MESSAGES.INSUFFICENT_BALANCE };
    }

    this.deduct = amount;

    this.history.push(transaction);
    return transaction;
  }

  async save() {
    const wallet = await this.repository.create(this);
    return new WalletService(wallet);
  }

  update(data: Partial<IWallet>) {
    return this.repository.update(<string>(<unknown>this.id), data);
  }

  delete() {
    return this.repository.delete(<string>(<unknown>this.id));
  }

  static async find() {
    const wallets = await WalletRepository.find();
    return wallets.map((wallet) => {
      return new WalletService(wallet);
    });
  }

  static async findOne(query: string) {
    const wallet = await WalletRepository.findOne(query);
    if (wallet) return new WalletService(wallet);
    return null;
  }

  static delete(data: string | Partial<IWallet>) {
    return WalletRepository.delete(data);
  }

  static update(query: string | Partial<IWallet>, data: Partial<IWallet>) {
    return WalletRepository.update(query, data);
  }

  static create(data: IWallet) {
    return WalletRepository.create(data);
  }
}

export default WalletService;
