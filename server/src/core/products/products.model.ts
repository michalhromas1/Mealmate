export interface Product {
  title: string;
  results: ProductResults[];
}

export interface ProductResults {
  website: string;
  variants: ProductVariant[];
}

export interface ProductVariant {
  title: string;
  price: string;
  pricePerKg: string;
  quantity: string;
}
