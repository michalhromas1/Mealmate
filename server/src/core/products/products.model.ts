export interface Product {
  title: string;
  results: ProductResults[];
}

export interface ProductResults {
  eshop: string;
  variants: ProductVariant[];
}

export interface ProductVariant {
  title: string;
  unit: string;
  unitPrice: string;
  currency: string;
  image: string;
  link: string;
}
