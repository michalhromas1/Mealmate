import * as puppeteer from 'puppeteer';
import { puppeteerAdapter as pup } from '../adapters/puppeteer-adapter/puppeteer-adapter';
import {
  CrawledWebsite,
  CrawledWebsiteProductSelectors,
  CrawledWebsiteSearchSelectors,
} from '../crawled-websites/crawled-websites.model';
import { Product } from './products.model';

export class Products {
  private browser: puppeteer.Browser;

  constructor(private websites: CrawledWebsite[], private queries: string[]) {}

  async fetchProducts(): Promise<Product[][][]> {
    this.browser = await pup.createBrowser();
    const products = await this.crawlWebsitesForProducts();
    await pup.closeBrowser(this.browser);
    return products;
  }

  private async crawlWebsitesForProducts(): Promise<Product[][][]> {
    return Promise.all(
      this.websites.map(async (web) => {
        const page = await pup.createPage(this.browser);

        return Promise.all(
          this.queries.map(async (query) => {
            await pup.navigateTo(page, web.url);
            await this.searchForProducts(page, web.selectors.search, query);
            return await this.getAllFoundProducts(page, web.selectors.product);
          })
        );
      })
    );
  }

  private async searchForProducts(
    page: puppeteer.Page,
    searchSelectors: CrawledWebsiteSearchSelectors,
    query: string
  ): Promise<void> {
    await pup.search(page, searchSelectors.input, searchSelectors.submit, query);
  }

  private async getAllFoundProducts(
    page: puppeteer.Page,
    productSelectors: CrawledWebsiteProductSelectors
  ): Promise<Product[]> {
    await page.waitForSelector(productSelectors.title);
    const productEls = await page.$$(productSelectors.element);
    return Promise.all(
      productEls.map((productEl) => this.getFoundProduct(productEl, productSelectors))
    );
  }

  private async getFoundProduct(
    productEl: puppeteer.ElementHandle<Element>,
    productSelectors: CrawledWebsiteProductSelectors
  ): Promise<Product> {
    const price = await this.getProductProperty(productEl, productSelectors.price);
    const priceFraction = await this.getProductProperty(productEl, productSelectors.priceFraction);

    return {
      price: `${price}.${priceFraction}`,
      title: await this.getProductProperty(productEl, productSelectors.title),
      pricePerKg: await this.getProductProperty(productEl, productSelectors.pricePerKg),
      quantity: await this.getProductProperty(productEl, productSelectors.quantity),
    };
  }

  private async getProductProperty(
    productEl: puppeteer.ElementHandle<Element>,
    propertySelector: string
  ): Promise<string> {
    const fallback = '';
    const propertyEl = await productEl.$(propertySelector);
    return propertyEl
      ? this.parseProperty(await pup.getProperty<string>(propertyEl, 'textContent', fallback))
      : fallback;
  }

  private parseProperty(property: string): string {
    return property.trim().replace(/  |\r\n|\n|\r/gm, '');
  }
}
