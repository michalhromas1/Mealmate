import { CrawledWebsite } from '../crawled-websites.model';

export const kosik: CrawledWebsite = {
  url: 'https://kosik.cz',
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
