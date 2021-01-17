import * as express from 'express';
import { expressAdapter } from './app/express-adapter/express-adapter';

export const router = express.Router();

expressAdapter.createGetRoute(router, 'products', (res) => {
  const products = [
    {
      title: 'losos',
      price: '30',
    },
    {
      title: 'jahody',
      price: '5',
    },
  ];
  res.json(products);
});
