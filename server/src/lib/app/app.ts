import { ExpressAdapter } from '../adapters/express-adapter/express-adapter';
import { AppStartCallback, AppStartConfig } from './app.model';

export class App {
  constructor(private config: AppStartConfig) {}

  start(callback?: AppStartCallback): void {
    ExpressAdapter.startServer(this.config, callback);
  }
}
