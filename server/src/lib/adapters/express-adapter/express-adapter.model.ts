import * as express from 'express';

export interface ExpressAdapterServerConfig {
  port: number;
  basePath: string;
  router: ExpressAdapterRouter;
}

export type ExpressAdapterRouter = express.Router;

export type ExpressAdapterStartServerCallback = (config: ExpressAdapterServerConfig) => void;

export interface ExpressAdapterCreateGetRouteParams {
  path: string;
  router: ExpressAdapterRouter;
}

export type ExpressAdapterGetRouteAction<T> = (response: express.Response<T>) => void;
