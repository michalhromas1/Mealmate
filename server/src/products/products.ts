import * as puppeteer from 'puppeteer';
import { puppeteerAdapter as pup } from '../adapters/puppeteer-adapter/puppeteer-adapter';

interface Product {
  title: string;
  price: string;
  pricePerKg: string;
  quantity: string;
}

export class Products {
  private browser: puppeteer.Browser;
  private page: puppeteer.Page;

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
    const url = 'https://rohlik.cz';
    const inputSelector = '#searchGlobal';
    const submitSelector = '#searchForm button';
    const query = 'jahody';

    await pup.navigateTo(this.page, url);
    await pup.search(this.page, inputSelector, submitSelector, query);

    return await this.getProducts();
  }

  private async getProducts(): Promise<Product[]> {
    await this.page.waitForSelector('.productCard__title');
    const productEls = await this.page.$$('.productCard__wrapper');
    return Promise.all(productEls.map((el) => this.createProduct(el)));
  }

  private async createProduct(productEl: puppeteer.ElementHandle<Element>): Promise<Product> {
    const title = await this.getElementText(productEl, '.productCard__title');
    const pricePerKg = await this.getElementText(productEl, '.pricePerOffer');
    const quantity = await this.getElementText(productEl, '.quantity');
    const price = await this.getElementText(productEl, '.cardPrice .wrap .price');
    const priceFraction = await this.getElementText(productEl, '.cardPrice .wrap .fraction');
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
    const el = await parentEl.$(selector);
    const property = await el?.getProperty('textContent');
    return ((await property?.jsonValue()) as string) || '';
  }
}
