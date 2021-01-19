import { CrawledWebsite } from './products/products.model';

export const rohlikConfig: CrawledWebsite = {
  url: 'https://rohlik.cz',
  query: 'bábovka',
  selectors: {
    search: {
      input: '#searchGlobal',
      submit: '#searchForm button',
    },
    product: {
      element: '.productCard__wrapper',
      title: '.productCard__title',
      pricePerKg: '.pricePerOffer',
      quantity: '.quantity',
      price: '.cardPrice .wrap .price',
      priceFraction: '.cardPrice .wrap .fraction',
    },
  },
};
