export namespace testData {
  export const validUserData = {
    firstname: 'shehu',
    lastname: 'lawal',
    password: 'abcd1234',
    username: 'fatiudeen',
  };

  export const inCompleteUserData = {
    firstname: 'shehu',
    lastname: 'lawal',
    password: 'abcd1234',
  };

  export const validLoginData = {
    password: 'abcd1234',
    username: 'fatiudeen',
  };

  export const invalidLoginData = {
    password: 'abcd1234',
    username: 'fatiudeen',
  };

  export const randomId = 58;

  export const validFundData = {
    amount: 50000,
  };

  export const invalidFundData = {
    amount: 'b50000',
  };

  export const validTransferData = {
    amount: 50000,
    userId: 2,
  };

  export const invalidUserTransferData = {
    amount: 500000,
    userId: 700,
  };

  export const invalidBalanceTransferData = {
    amount: 5000000,
    userId: 2,
  };

  export const validWithdrawData = {
    amount: 50000,
    accountNumber: 1234567890,
    accountName: 'shehu lawal',
  };

  export const invalidBalanceWithdrawData = {
    amount: 5000000,
    accountNumber: 1234567890,
    accountName: 'shehu lawal',
  };

  export const invalidAccountNumberWithdrawData = {
    amount: 500000,
    accountNumber: 12345678900,
    accountName: 'shehu lawal',
  };
}
