export interface CrawledWebsite {
  url: string;
  selectors: CrawledWebsiteSelectors;
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
  variant: string;
  noVariants: string;
  title: string;
  pricePerKg: string;
  quantity: string;
  price: string;
  priceFraction: string;
}
