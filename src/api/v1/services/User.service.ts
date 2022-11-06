/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import Service from '@services/service';
import { IUser } from '@interfaces/User.interface';
import { scryptSync, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { JWT_KEY } from '@config';
import UserRepository from '@repositories/User.Repository';
import { IWallet } from '@interfaces/Wallet.interface';
import WalletService from '@services/Wallet.service';

class UserService extends Service<IUser> implements IUser {
  protected model: 'users' = 'users';
  private scryptSync = scryptSync;
  protected repository = UserRepository;
  public id;
  public firstname;
  public lastname;
  public password;
  public username;
  public wallet = 0;
  private user?;

  constructor(user: IUser, trailingProperties = false) {
    super();
    this.id = user.id || null;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.password = this.toHash(user.password);
    this.username = user.username;
    this.wallet = user.wallet!;
    this.user = { ...user, wallet: this.wallet };
    if (!trailingProperties) {
      delete this.user;
      delete (<any>this).model;
      delete (<any>this).repository;
    }
  }

  get fullname() {
    return `${this.firstname} ${this.lastname}`;
  }

  private toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = <Buffer>this.scryptSync(password, salt, 64);
    return `${buf.toString('hex')}.${salt}`;
  }

  generateToken() {
    const token = jwt.sign(<string>(<unknown>this.id), <string>JWT_KEY);
    return token;
  }

  compare(password: string) {
    const [hashPassword, salt] = this.password.split('.');
    const buf = <Buffer>this.scryptSync(password, salt, 64);
    return buf.toString('hex') === hashPassword;
  }

  async save() {
    let user;
    if (this.id) {
      user = await this.repository.update(this.id, this.user!);
    } else {
      const wallet = await WalletService.create();

      user = await this.repository.create({ ...this.user!, wallet: wallet.id });
    }
    return new UserService(user);
  }

  update(data: Partial<IUser>) {
    return this.repository.update(this.id!, data);
  }

  delete() {
    return this.repository.delete(this.id!);
  }

  async myWallet() {
    if (this.wallet < 1) return this;
    const wallet = await WalletService.findOne(this.wallet!);
    const result = <Partial<IWallet>>JSON.parse(JSON.stringify(wallet));
    delete result.history;
    return { ...this, wallet: result };
  }

  async myHistory() {
    const wallet = await WalletService.findOne(this.wallet);
    if (!wallet) return <IWallet['history']>[];
    return wallet.history;
  }

  static async find() {
    const users = await UserRepository.find();
    return users.map((user) => {
      return new UserService(user);
    });
  }

  static async findOne(query: number | Partial<IUser>) {
    const user = await UserRepository.findOne(query);
    if (user) return new UserService(user);
    return null;
  }

  static delete(data: number | Partial<IUser>) {
    return UserRepository.delete(data);
  }

  static update(query: number | Partial<IUser>, data: Partial<IUser>) {
    return UserRepository.update(query, data);
  }

  static async create(data: IUser) {
    const user = new UserService(data, true);
    return user.save();
  }
}

export default UserService;
