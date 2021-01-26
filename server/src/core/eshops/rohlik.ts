import { Eshop } from './eshops.model';

export const rohlik: Eshop = {
  url: 'https://rohlik.cz',
  selectors: {
    search: {
      input: '#searchGlobal',
      submit: '#searchForm button',
    },
    product: {
      variant: '.productCard__wrapper',
      title: '.productCard__title',
      unitPrice: '.pricePerOffer',
      noVariants: '[data-test="no-products-found"]',
      image: '.productCard__img',
      link: 'a.imgWrapper',
    },
  },
};
