export type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] };

export type Transactions<T extends 'credit' | 'debit'> = {
  id: string;
  success: boolean;
  type: T;
  amount: number;
  date: string;
  balance: number;
  from: T extends 'credit' ? string : never;
  to: T extends 'credit' ? never : string;
  desc: string;
};

export interface IWallet {
  id: number | null;
  balance: number;
  history: Array<OmitNever<Transactions<'credit'>> | OmitNever<Transactions<'debit'>>>;
  [key: string]: any;
}
