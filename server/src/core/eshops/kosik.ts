import { Eshop } from './eshops.model';

const productSelector = '[data-tid="product-box"]';

export const kosik: Eshop = {
  url: 'https://kosik.cz',
  selectors: {
    search: {
      input: '[data-tid="search__input-field"]',
      submit: 'form.product-search__form .product-search__submit',
    },
    product: {
      variant: productSelector,
      title: `${productSelector} .name`,
      unitPrice: `${productSelector} .price-unit`,
      unitDelimeter: '/',
      noVariants: '[data-v-1ea39232]',
      image: 'a.top-wrapper img',
      link: 'a.top-wrapper',
    },
  },
};
