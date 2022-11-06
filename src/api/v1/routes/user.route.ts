import userController from '@controllers/user.controller';
import userDto from '@dtos/user.dto';
import Route from '@routes/route';
import { IUser } from '@interfaces/User.interface';

class UserRoute extends Route<IUser> {
  controller = userController;
  dto = userDto;
  initRoutes() {
    this.router
      .route('/') // all users
      .get(this.controller.getAll);
    this.router.route('/me').get(this.controller.getMe);
    this.router.route('/:userId').get(this.validator(this.dto.id), this.controller.getUser);

    return this.router;
  }
}

export default new UserRoute();
