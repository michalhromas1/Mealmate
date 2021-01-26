import { AppRouter } from './app/app-router';
import { Router } from './app/app.model';
import { Eshop } from './eshops/eshops.model';
import { kosik } from './eshops/kosik';
import { rohlik } from './eshops/rohlik';
import { Products } from './products/products';

export const createAppRouter = (): Router => {
  const router = new AppRouter();

  router.addGetRoute('products', async (res) => {
    // console.log('running benchmark...');

    // let totalTime = 0;
    // const nOfTries = 1;

    // let fetchedProducts: Product[] = [];

    // for (let i = 0; i < nOfTries; i++) {
    //   const t0 = Date.now();

    //   const eshops: Eshop[] = [rohlik, kosik];
    //   const queries = [
    //     'mango',
    //     'losos',
    //     'chřest',
    //     // 'banán',
    //     // 'mrkev',
    //     // 'palačinky',
    //     // 'pomelo',
    //     // 'kuře',
    //     // 'těstoviny',
    //     // 'bramborový salát',
    //   ];

    //   const products = new Products(eshops, queries);
    //   fetchedProducts = await products.fetchProducts();

    //   const time = Date.now() - t0;
    //   totalTime += time;

    //   console.log(Date.now() - t0, 'ms');
    // }

    // console.log(`avg: ${totalTime / nOfTries} ms`);
    // console.log('benchmark finished');

    // res.json(fetchedProducts);

    // let fetchedProducts: Product[] = [];

    const fetchedProducts = await measure(1, async () => {
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
      const products = new Products(eshops, queries);
      return await products.fetchProducts();
    });

    res.json(fetchedProducts);
  });

  return router.getRouter();
};

async function measure<T>(tryCount: number, subject: () => T): Promise<T> {
  let totalTime = 0;
  let response: T;

  console.log('running benchmark...');

  for (let i = 0; i < tryCount; i++) {
    const t0 = Date.now();
    response = await subject();
    const time = Date.now() - t0;
    totalTime += time;

    console.log(Date.now() - t0, 'ms');
  }

  console.log(`avg: ${totalTime / tryCount} ms`);
  console.log('benchmark finished');

  return response!;
}
