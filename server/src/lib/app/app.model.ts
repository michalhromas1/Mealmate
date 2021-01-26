import {
  ExpressAdapterGetRouteAction,
  ExpressAdapterRouter,
  ExpressAdapterServerConfig,
  ExpressAdapterStartServerCallback,
} from '../adapters/express-adapter/express-adapter.model';

export type AppStartConfig = ExpressAdapterServerConfig;
export type AppStartCallback = ExpressAdapterStartServerCallback;

export type Router = ExpressAdapterRouter;
export type GetRouteAction<T> = ExpressAdapterGetRouteAction<T>;
