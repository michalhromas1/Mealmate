import { ProductVariant } from '../products/products.model';

export interface Eshop {
  url: string;
  selectors: EshopSelectors;
}

export interface EshopSelectors {
  search: EshopSearchSelectors;
  product: EshopProductSelectors;
}

export interface EshopSearchSelectors {
  input: string;
  submit: string;
}

export interface EshopProductSelectors extends ProductVariant {
  variant: string;
  noVariants: string;
}
