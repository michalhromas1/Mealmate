import * as bodyparser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import {
  ExpressAdapterCreateGetRouteParams,
  ExpressAdapterGetRouteAction,
  ExpressAdapterRouter,
  ExpressAdapterServerConfig,
  ExpressAdapterStartServerCallback,
} from './express-adapter.model';

export class ExpressAdapter {
  static startServer(
    config: ExpressAdapterServerConfig,
    callback?: ExpressAdapterStartServerCallback
  ): void {
    const server = express();

    server.use(cors());
    server.use(bodyparser.json());
    server.use(config.basePath, config.router);

    server.listen(config.port, () => {
      if (callback) {
        callback(config);
      }
    });
  }

  static createRouter(): ExpressAdapterRouter {
    return express.Router();
  }

  static createGetRoute<T>(
    params: ExpressAdapterCreateGetRouteParams,
    action: ExpressAdapterGetRouteAction<T>
  ): void {
    params.router.get(`/${params.path}`, (request, response, next) => {
      action(response);
    });
  }
}
