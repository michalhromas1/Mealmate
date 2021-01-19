import { expressAdapter } from './adapters/express-adapter/express-adapter';
import { router } from './router';

const port = 3000;
const basePath = '/api';

expressAdapter.startServer(port, basePath, router, () => {
  console.log('Server started at port: ' + port);
});
