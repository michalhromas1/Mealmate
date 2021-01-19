import * as express from 'express';
import { expressAdapter } from './adapters/express-adapter/express-adapter';
import { crawledWebsites } from './crawled-websites/crawled-websites';
import { Products } from './products/products';

export const router = express.Router();

expressAdapter.createGetRoute(router, 'products', async (res) => {
  const products = new Products(crawledWebsites);
  res.json(await products.fetchProducts());
});
