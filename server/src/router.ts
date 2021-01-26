import { AppRouter } from './app/app-router';
import { GetRouteAction, Router } from './app/app.model';
import { Benchmark } from './benchmark/benchmark';
import { Eshop } from './eshops/eshops.model';
import { kosik } from './eshops/kosik';
import { rohlik } from './eshops/rohlik';
import { Products } from './products/products';
import { Product } from './products/products.model';

export const createAppRouter = (): Router => {
  const router = new AppRouter();
  addRoutes(router);
  return router.getRouter();
};

const addRoutes = (router: AppRouter): void => {
  router.addGetRoute('products', getProductsRouteAction);
};

const getProductsRouteAction: GetRouteAction<Product[]> = async (response) => {
  const benchmarkCount = 5;
  const eshops: Eshop[] = [rohlik, kosik];
  const queries = [
    'mango',
    'losos',
    'chřest',
    // 'banán',
    // 'mrkev',
    // 'palačinky',
    // 'pomelo',
    // 'kuře',
    // 'těstoviny',
    // 'bramborový salát',
  ];

  const fetchedProducts = await Benchmark.measure(benchmarkCount, async () => {
    const products = new Products(eshops, queries);
    return await products.fetchProducts();
  });

  response.json(fetchedProducts);
};
