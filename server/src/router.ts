import * as express from 'express';
import { expressAdapter } from './adapters/express-adapter/express-adapter';
import { crawledWebsites } from './crawled-websites/crawled-websites';
import { Products } from './products/products';

export const router = express.Router();

expressAdapter.createGetRoute(router, 'products', async (res) => {
  const queries = [
    'mango',
    'spacák',
    'losos',
    // 'chřest',
    // 'mrkev',
    // 'palačinky',
    // 'pomelo',
    // 'kuře',
    // 'těstoviny',
    // 'bramborový salát',
  ];
  const products = new Products(crawledWebsites, queries);
  res.json(await products.fetchProducts());
});
