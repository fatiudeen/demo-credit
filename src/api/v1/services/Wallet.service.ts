import Service from '@services/service';
import { IWallet, Transactions, OmitNever } from '@interfaces/Wallet.interface';
import WalletRepository from '@repositories/Wallet.Repository';
import UserService from '@services/User.service';
import { MESSAGES } from '@config';

class WalletService extends Service<IWallet> implements IWallet {
  protected repository = WalletRepository;
  protected model: 'wallets' = 'wallets';
  public id;
  public balance;
  public history;
  private wallet;

  constructor(wallet: Partial<IWallet> = {}, trailingProperties = false) {
    super();
    this.id = wallet.id || null;
    this.balance = wallet.balance || 0;
    this.history = JSON.parse(<string>(<unknown>wallet.history)) || [];
    this.wallet = wallet;
    if (!trailingProperties) {
      delete this.wallet;
      delete (<any>this).model;
      delete (<any>this).repository;
      // delete (<any>this).wallet.repository;
      // delete (<any>this).wallet.repository;
      // delete (<any>this).wallet.wallet;
    }
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
    this.topUp = amount;
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
    this.save();
    return transaction;
  }
  public async transfer(amount: number, userId: number) {
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
    let wallet;
    if (this.id) {
      wallet = await this.repository.update(this.id!, {
        balance: this.balance,
        history: this.history,
      });
    } else {
      wallet = await this.repository.create(this.wallet!);
    }
    return new WalletService(wallet);
  }

  update(data: Partial<IWallet>) {
    return this.repository.update(this.id!, data);
  }

  delete() {
    return this.repository.delete(this.id!);
  }

  static findOwner(id: number) {
    return UserService.findOne(id);
  }

  static async findOne(query: number) {
    const wallet = await WalletRepository.findOne(query);
    if (wallet) return new WalletService(wallet, true);
    return null;
  }

  // static delete(data: number | Partial<IWallet>) {
  //   return WalletRepository.delete(data);
  // }

  // static update(query: number | Partial<IWallet>, data: Partial<IWallet>) {
  //   return WalletRepository.update(query, data);
  // }

  static create() {
    const data: Partial<IWallet> = {
      balance: 0,
    };
    return WalletRepository.create(data);
  }
}

export default WalletService;
