export type Products = Product[];

export interface Product {
  title: string;
  webResults: ProductVariantsOnWebsite[];
}

export interface ProductVariantsOnWebsite {
  website: string;
  productVariants: ProductVariant[];
}

export interface ProductVariant {
  title: string;
  price: string;
  pricePerKg: string;
  quantity: string;
}
