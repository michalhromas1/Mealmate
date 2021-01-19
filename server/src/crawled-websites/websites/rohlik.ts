import { CrawledWebsite } from '../crawled-websites.model';

export const rohlik: CrawledWebsite = {
  url: 'https://rohlik.cz',
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
