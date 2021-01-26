import { AppRouter } from '../lib/app/app-router';
import { Router } from '../lib/app/app.model';
import { getProductsAction } from './actions/get-products-action';

export const createAppRouter = (): Router => {
  const router = new AppRouter();
  addRoutes(router);
  return router.getRouter();
};

const addRoutes = (router: AppRouter): void => {
  router.addGetRoute('products', getProductsAction);
};
