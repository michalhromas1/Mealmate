export interface Product {
  title: string;
  price: string;
  pricePerKg: string;
  quantity: string;
}

export interface CrawledWebsite {
  url: string;
  selectors: CrawledWebsiteSelectors;
  query: string;
}

export interface CrawledWebsiteSelectors {
  search: CrawledWebsiteSearchSelectors;
  product: CrawledWebsiteProductSelectors;
}

export interface CrawledWebsiteSearchSelectors {
  input: string;
  submit: string;
}

export interface CrawledWebsiteProductSelectors {
  element: string;
  title: string;
  pricePerKg: string;
  quantity: string;
  price: string;
  priceFraction: string;
}
