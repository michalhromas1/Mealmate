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

export interface EshopProductSelectors {
  variant: string;
  noVariants: string;
  title: string;
  unitPrice: string;
  unitDelimeter: string;
  image: string;
  link: string;
}
