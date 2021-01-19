import * as puppeteer from 'puppeteer';
import { puppeteerAdapter as pup } from '../adapters/puppeteer-adapter/puppeteer-adapter';
import { Product, ProductCrawlerOptions } from './products.model';

export class Products {
  private browser: puppeteer.Browser;
  private page: puppeteer.Page;

  constructor(private options: ProductCrawlerOptions) {}

  async fetchProducts(): Promise<Product[]> {
    this.browser = await pup.createBrowser();
    const products = await this.crawlWebsitesForProducts();
    await pup.closeBrowser(this.browser);
    return products;
  }

  private async crawlWebsitesForProducts(): Promise<Product[]> {
    this.page = await this.browser.newPage();
    await this.searchForProducts();
    return await this.getAllFoundProducts();
  }

  private async searchForProducts(): Promise<void> {
    const { search: searchSelectors } = this.options.selectors;

    await pup.navigateTo(this.page, this.options.url);
    await pup.search(this.page, searchSelectors.input, searchSelectors.submit, this.options.query);
  }

  private async getAllFoundProducts(): Promise<Product[]> {
    const { product: productsSelectors } = this.options.selectors;

    await this.page.waitForSelector(productsSelectors.title);
    const productEls = await this.page.$$(productsSelectors.element);
    return Promise.all(productEls.map((el) => this.getFoundProduct(el)));
  }

  private async getFoundProduct(productEl: puppeteer.ElementHandle<Element>): Promise<Product> {
    const { product: productsSelectors } = this.options.selectors;

    const price = await this.getProductProperty(productEl, productsSelectors.price);
    const priceFraction = await this.getProductProperty(productEl, productsSelectors.priceFraction);

    return {
      price: `${price}.${priceFraction}`,
      title: await this.getProductProperty(productEl, productsSelectors.title),
      pricePerKg: await this.getProductProperty(productEl, productsSelectors.pricePerKg),
      quantity: await this.getProductProperty(productEl, productsSelectors.quantity),
    };
  }

  private async getProductProperty(
    productEl: puppeteer.ElementHandle<Element>,
    propertySelector: string
  ): Promise<string> {
    const fallback = '';
    const propertyEl = await productEl.$(propertySelector);
    return propertyEl ? pup.getProperty<string>(propertyEl, 'textContent', fallback) : fallback;
  }
}
