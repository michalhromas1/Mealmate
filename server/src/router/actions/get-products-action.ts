import { Eshop } from '../../core/eshops/eshops.model';
import { kosik } from '../../core/eshops/kosik';
import { rohlik } from '../../core/eshops/rohlik';
import { Products } from '../../core/products/products';
import { Product } from '../../core/products/products.model';
import { GetRouteAction } from '../../lib/app/app.model';
import { Benchmark } from '../../lib/benchmark/benchmark';

export const getProductsAction: GetRouteAction<Product[]> = async (response) => {
  const benchmarkCount = 1;
  const eshops: Eshop[] = [rohlik, kosik];
  const queries = [
    'mango',
    // 'spacák',
    // 'chřest',
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
