import { CrawledWebsite } from '../crawled-websites.model';

const productSelector = '[data-tid="product-box"]';

export const kosik: CrawledWebsite = {
  url: 'https://kosik.cz',
  selectors: {
    search: {
      input: '[data-tid="search__input-field"]',
      submit: 'form.product-search__form .product-search__submit',
    },
    product: {
      variant: productSelector,
      title: `${productSelector} .name`,
      pricePerKg: `${productSelector} .price-unit`,
      quantity: `${productSelector} .quantity span`,
      price: `${productSelector} .price`,
      priceFraction: `${productSelector} .price`,
      // noVariants: '[data-v-1ea39232]',
      noVariants: '.ahojdajdadaa',
    },
  },
};
