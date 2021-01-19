import * as express from 'express';
import { expressAdapter } from './adapters/express-adapter/express-adapter';
import { Products } from './products/products';
import { rohlikConfig } from './site-configs';

export const router = express.Router();

expressAdapter.createGetRoute(router, 'products', async (res) => {
  const products = new Products([rohlikConfig, rohlikConfig, rohlikConfig]);
  res.json(await products.fetchProducts());
});
