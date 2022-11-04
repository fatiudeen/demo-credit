/* eslint-disable no-unused-vars */
export interface IUser {
  id: number | null;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  wallet: number | null;
  generateToken(): string;
  compare(password: string): Promise<boolean>;
  [key: string]: any;
}
