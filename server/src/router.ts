import * as express from 'express';
import { expressAdapter } from './adapters/express-adapter/express-adapter';
import { products } from './products/products';

export const router = express.Router();

expressAdapter.createGetRoute(router, 'products', async (res) =>
  res.json(await products.fetchProducts())
);
