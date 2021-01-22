import { CrawledWebsite } from '../crawled-websites.model';

export const rohlik: CrawledWebsite = {
  url: 'https://rohlik.cz',
  selectors: {
    search: {
      input: '#searchGlobal',
      submit: '#searchForm button',
    },
    product: {
      variant: '.productCard__wrapper',
      title: '.productCard__title',
      pricePerKg: '.pricePerOffer',
      quantity: '.quantity',
      price: '.cardPrice .wrap .price',
      priceFraction: '.cardPrice .wrap .fraction',
      noVariants: '[data-test="no-products-found"]',
    },
  },
};
