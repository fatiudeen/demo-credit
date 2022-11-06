import requestController from '@controllers/wallet.controller';
import requestDto from '@dtos/wallet.dto';
import Route from '@routes/route';
import { IWallet } from '@interfaces/Wallet.interface';

class WalletsRoute extends Route<IWallet> {
  controller = requestController;
  dto = requestDto;
  initRoutes() {
    this.router.route('/fund').post(this.validator(this.dto.fund), this.controller.fund);
    this.router
      .route('/withdraw')
      .post(this.validator(this.dto.withdraw), this.controller.withdraw);
    this.router
      .route('/transfer')
      .post(this.validator(this.dto.transfer), this.controller.transfer);
    this.router.route('/history').get(this.controller.getTxnHistory);

    return this.router;
  }
}

export default new WalletsRoute();
