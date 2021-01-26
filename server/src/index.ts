import { App } from './lib/app/app';
import { createAppRouter } from './router/router';

const app = new App({
  port: 3000,
  basePath: '/api',
  router: createAppRouter(),
});

app.start((config) => {
  console.log('Server started at port: ' + config.port);
});
