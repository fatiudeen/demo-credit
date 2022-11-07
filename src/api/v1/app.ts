import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { logger } from '@utils/logger';
import { httpErrorHandler } from '@middlewares/errorHandler';
import { error404 } from '@middlewares/error404';
import { docs } from '@middlewares/docs';
import { verify } from '@middlewares/jwt';
import authRoute from '@routes/auth.route';
import walletRoute from '@routes/wallet.route';
import userRoute from '@routes/user.route';
import { MESSAGES } from '@config';

class App {
  private app: Application;
  constructor() {
    this.app = express();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandlers();
  }

  private initRoutes() {
    this.app.use('/api/v1/users', verify, userRoute.initRoutes());
    this.app.use('/api/v1/wallets', verify, walletRoute.initRoutes());
    this.app.use('/docs', docs);
    this.app.use('/api/v1/', authRoute.initRoutes());
    this.app.get('/', (req, res) => {
      res.send(MESSAGES.WELCOME);
    });
  }
  private initMiddlewares() {
    this.app.use(
      cors({
        origin: ['*'],
      }),
    );
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));
    this.app.use(express.json());
  }

  private initErrorHandlers() {
    this.app.use(httpErrorHandler);
    this.app.use('*', error404);
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      logger.info(`running on port ${port}`);
    });
  }

  public instance() {
    return this.app;
  }
}

export default new App();
