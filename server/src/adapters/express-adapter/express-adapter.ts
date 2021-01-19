import * as bodyparser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

export const expressAdapter = {
  startServer(port: number, basePath: string, router: express.Router, callback?: () => void): void {
    const server = express();
    server.use(cors());
    server.use(bodyparser.json());
    server.use(basePath, router);

    server.listen(port, () => {
      if (callback) {
        callback();
      }
    });
  },

  createGetRoute<T>(
    router: express.Router,
    path: string,
    action: (res: express.Response<T>) => void
  ) {
    router.get(`/${path}`, (req, res, next) => {
      action(res);
    });
  },
};
