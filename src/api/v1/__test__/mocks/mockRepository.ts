import UserRepository from '@repositories/User.Repository';
import { IUser } from '@interfaces/User.interface';
import { IWallet } from '@interfaces/Wallet.interface';
import WalletRepository from '@repositories/Wallet.Repository';

const userData = <IUser[]>[];
const walletData = <IWallet[]>[];

function findModel(_id: number | Partial<IUser> | Partial<IWallet>, wallet = false) {
  let model;
  if (wallet === true) {
    model = walletData;
  } else model = userData;

  return model.findIndex((user) => {
    if (typeof _id === 'number') {
      return _id === user.id;
    }
    return user[Object.keys(_id)[0]] === _id[Object.keys(_id)[0]];
  });
}

jest.spyOn(UserRepository, 'create').mockImplementation((_user: Partial<IUser>) => {
  const user = <IUser>{
    ..._user,
    id: (userData.length || 0) + 1,
    createdAt: new Date().toISOString(),
  };
  userData.push(user);
  return Promise.resolve(user);
});

jest.spyOn(UserRepository, 'find').mockImplementation(() => {
  return Promise.resolve(userData);
});

jest.spyOn(UserRepository, 'findOne').mockImplementation((_id: number | Partial<IUser>) => {
  const result = findModel(_id);

  // if (result === -1) return Promise.reject(new Error('rejected find user'));
  return Promise.resolve(userData[result]);
});

jest
  .spyOn(UserRepository, 'update')
  .mockImplementation((_id: number | Partial<IUser>, _data: Partial<IUser>) => {
    const result = findModel(_id);

    const updatedData = userData[result];
    Object.keys(updatedData).forEach((key) => {
      if (_data[key]) {
        updatedData[key] = _data[key];
      }
    });
    userData.splice(result, 1, updatedData);

    return Promise.resolve(updatedData);
  });

jest.spyOn(UserRepository, 'delete').mockImplementation((_id: number | Partial<IUser>) => {
  const result = findModel(_id);
  const user = userData.slice(result, result + 1);
  return Promise.resolve(user[0]);
});

jest.spyOn(WalletRepository, 'create').mockImplementation((_wallet: Partial<IWallet>) => {
  const wallet = <IWallet>(<unknown>{
    ..._wallet,
    id: (walletData.length || 0) + 1,
    history: '[]',
    createdAt: new Date().toISOString(),
  });
  walletData.push(wallet);
  return Promise.resolve(wallet);
});

jest.spyOn(WalletRepository, 'find').mockImplementation(() => {
  return Promise.resolve(walletData);
});

jest.spyOn(WalletRepository, 'findOne').mockImplementation((_id: number | Partial<IWallet>) => {
  const _result = walletData[findModel(_id)];
  const history =
    typeof _result.history === 'string' ? _result.history : JSON.stringify(_result.history);
  const result = <any>{
    ..._result,
    history,
  };

  return Promise.resolve(result);
});

jest
  .spyOn(WalletRepository, 'update')
  .mockImplementation((_id: number | Partial<IWallet>, _data: Partial<IWallet>) => {
    const result = findModel(_id);

    const updatedData = walletData[result];
    Object.keys(updatedData).forEach((key) => {
      if (_data[key]) {
        updatedData[key] = _data[key];
      }
    });
    walletData.splice(result, 1, updatedData);

    return Promise.resolve(updatedData);
  });

jest.spyOn(WalletRepository, 'delete').mockImplementation((_id: number | Partial<IWallet>) => {
  const result = findModel(_id);
  const wallet = walletData.slice(result, result + 1);
  return Promise.resolve(wallet[0]);
});
