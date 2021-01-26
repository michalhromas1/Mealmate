import { ExpressAdapter } from '../adapters/express-adapter/express-adapter';
import { GetRouteAction, Router } from './app.model';

export class AppRouter {
  private router: Router;

  constructor() {
    this.router = ExpressAdapter.createRouter();
  }

  getRouter(): Router {
    return this.router;
  }

  addGetRoute<T>(path: string, action: GetRouteAction<T>): void {
    ExpressAdapter.createGetRoute({ router: this.router, path }, action);
  }
}
