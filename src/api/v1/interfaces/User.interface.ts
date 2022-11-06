/* eslint-disable no-unused-vars */
import { IWallet } from '@interfaces/Wallet.interface';
import UserService from '@services/User.service';
import WalletService from '@services/Wallet.service';

export interface IUser {
  id: number | null;
  firstname: string;
  lastname: string;
  password: string;
  username: string;
  wallet: number | null;
  // generateToken(): string | undefined;
  // compare(password: string): boolean;
  // myWallet(): Promise<UserService>;
  // myHistory(): Promise<IWallet['history']>;
  [key: string]: any;
}
