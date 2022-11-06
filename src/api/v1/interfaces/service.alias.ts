import UserService from '@services/User.service';
import WalletService from '@services/Wallet.service';

export type IService = Partial<typeof UserService> | Partial<typeof WalletService>;
