import { App } from './app/app';
import { createAppRouter } from './router';

const server = new App({
  port: 3000,
  basePath: '/api',
  router: createAppRouter(),
});

server.start((config) => {
  console.log('Server started at port: ' + config.port);
});
