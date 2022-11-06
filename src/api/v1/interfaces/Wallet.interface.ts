/* eslint-disable no-unused-vars */
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

// export type Transactions<T extends 'credit' | 'debit'> = OmitNever<NeverTransactions<T>>;

export interface IWallet {
  id: number | null;
  balance: number;
  history: Array<OmitNever<Transactions<'credit'>> | OmitNever<Transactions<'debit'>>>;
  // fund(amount: number): OmitNever<Transactions<'credit'>>;
  // transfer(amount: number, userId: string): Promise<OmitNever<Transactions<'debit'>>>;
  // withdraw(
  //   amount: number,
  //   accountNumber: number,
  //   accountName: string,
  // ): OmitNever<Transactions<'debit'>>;
  [key: string]: any;
}
