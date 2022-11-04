/* eslint-disable no-underscore-dangle */
import Service from '@services/service';
import { IUser } from '@interfaces/User.interface';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { JWT_KEY } from '@config';
import UserRepository from '@repositories/User.Repository';
import { IWallet } from '@interfaces/Wallet.interface';
import WalletService from '@services/Wallet.service';

class UserService extends Service<IUser> implements IUser {
  protected model: 'users' | 'wallets' = 'users';
  private scryptAsync = promisify(scrypt);
  protected repository = UserRepository;
  public id;
  public firstname;
  public lastname;
  private _password;
  public email;
  public wallet;

  constructor(user: IUser) {
    super();
    this.id = user.id || null;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this._password = user.password;
    this.email = user.email;
    this.wallet = user.walletId;
  }

  set password(value: string) {
    this._password = value;
    (async () => {
      this._password = await this.toHash();
    })();
  }

  get fullname() {
    return `${this.firstname} ${this.lastname}`;
  }

  private toHash = async () => {
    const salt = randomBytes(8).toString('hex');
    const buf = <Buffer>await this.scryptAsync(this._password, salt, 64);
    return `${buf.toString('hex')}.${salt}`;
  };

  generateToken = () => {
    const token = jwt.sign(<string>(<unknown>this.id), <string>JWT_KEY);
    return token;
  };

  compare = async (password: string) => {
    const [hashPassword, salt] = this._password.split('.');
    const buf = <Buffer>await this.scryptAsync(password, salt, 64);
    return buf.toString('hex') === hashPassword;
  };

  async save() {
    const user = await this.repository.create(this);
    return new UserService(user);
  }

  update(data: Partial<IUser>) {
    return this.repository.update(<string>(<unknown>this.id), data);
  }

  delete() {
    return this.repository.delete(<string>(<unknown>this.id));
  }

  async myWallet() {
    if (typeof this.wallet === 'string') {
      this.wallet = await WalletService.findOne(this.wallet);
      delete this.wallet.history;
    }
    return this;
  }

  async myHistory() {
    if (typeof this.wallet === 'string') {
      this.wallet = await WalletService.findOne(this.wallet);
    }
    return <IWallet['history']>this.wallet.history;
  }

  static async find() {
    const users = await UserRepository.find();
    return users.map((user) => {
      return new UserService(user);
    });
  }

  static async findOne(query: string | Partial<IUser>) {
    const user = await UserRepository.findOne(query);
    if (user) return new UserService(user);
    return null;
  }

  static delete(data: string | Partial<IUser>) {
    return UserRepository.delete(data);
  }

  static update(query: string | Partial<IUser>, data: Partial<IUser>) {
    return UserRepository.update(query, data);
  }

  static create(data: IUser) {
    return UserRepository.create(data);
  }
}

export default UserService;
