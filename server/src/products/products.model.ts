export interface Product {
  title: string;
  price: string;
  pricePerKg: string;
  quantity: string;
}

export interface ProductCrawlerOptions {
  url: string;
  selectors: ProductCrawlerSelectors;
  query: string;
}

export interface ProductCrawlerSelectors {
  search: ProductCrawlerSearchSelectors;
  product: ProductCrawlerProductSelectors;
}

export interface ProductCrawlerSearchSelectors {
  input: string;
  submit: string;
}

export interface ProductCrawlerProductSelectors {
  element: string;
  title: string;
  pricePerKg: string;
  quantity: string;
  price: string;
  priceFraction: string;
}
