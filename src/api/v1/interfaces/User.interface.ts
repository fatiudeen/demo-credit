export interface IUser {
  id: number | null;
  firstname: string;
  lastname: string;
  password: string;
  username: string;
  wallet: number | null;
  [key: string]: any;
}
