import userController from '@controllers/user.controller';
import userDto from '@dtos/user.dto';
import Route from '@routes/route';
import { IUser } from '@interfaces/User.interface';

class UserRoute extends Route<IUser> {
  controller = userController;
  dto = userDto;
  initRoutes() {
    this.router.route('/signup').post(this.validator(this.dto.signup), this.controller.signup);
    this.router.route('/signin').post(this.validator(this.dto.login), this.controller.login);

    return this.router;
  }
}

export default new UserRoute();
