import * as express from 'express';
import { expressAdapter } from './adapters/express-adapter/express-adapter';
import { crawledWebsites } from './crawled-websites/crawled-websites';
import { Products } from './products/products';

export const router = express.Router();

expressAdapter.createGetRoute(router, 'products', async (res) => {
  console.log('running benchmark...');

  let totalTime = 0;
  const nOfTries = 10;

  for (let i = 0; i < nOfTries; i++) {
    const t0 = Date.now();
    const queries = [
      'mango',
      'losos',
      'chřest',
      // 'spacák',
      // 'mrkev',
      // 'palačinky',
      // 'pomelo',
      // 'kuře',
      // 'těstoviny',
      // 'bramborový salát',
    ];
    const products = new Products(crawledWebsites, queries);
    const fetchedProducts = await products.fetchProducts();

    const time = Date.now() - t0;
    totalTime += time;

    console.log(Date.now() - t0, 'ms');
  }

  console.log(`avg: ${totalTime / nOfTries} ms`);
  console.log('benchmark finished');

  res.json([]);
});
