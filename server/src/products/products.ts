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
    return await this.crawlRohlikForProducts();
  }

  private async crawlRohlikForProducts(): Promise<Product[]> {
    const { search: searchSelectors } = this.options.selectors;

    await pup.navigateTo(this.page, this.options.url);
    await pup.search(this.page, searchSelectors.input, searchSelectors.submit, this.options.query);

    return await this.getProducts();
  }

  private async getProducts(): Promise<Product[]> {
    const { product: productsSelectors } = this.options.selectors;

    await this.page.waitForSelector(productsSelectors.title);
    const productEls = await this.page.$$(productsSelectors.element);
    return Promise.all(productEls.map((el) => this.createProduct(el)));
  }

  private async createProduct(productEl: puppeteer.ElementHandle<Element>): Promise<Product> {
    const { product: productsSelectors } = this.options.selectors;

    const title = await this.getElementText(productEl, productsSelectors.title);
    const pricePerKg = await this.getElementText(productEl, productsSelectors.pricePerKg);
    const quantity = await this.getElementText(productEl, productsSelectors.quantity);
    const price = await this.getElementText(productEl, productsSelectors.price);
    const priceFraction = await this.getElementText(productEl, productsSelectors.priceFraction);
    const fullPrice = `${price}.${priceFraction}`;

    return {
      title,
      price: fullPrice,
      pricePerKg,
      quantity,
    };
  }

  private async getElementText(
    parentEl: puppeteer.ElementHandle<Element>,
    selector: string
  ): Promise<string> {
    const fallback = '';
    const element = await parentEl.$(selector);
    return element ? pup.getProperty<string>(element, 'textContent', fallback) : fallback;
  }
}
