import * as puppeteer from 'puppeteer';
import { puppeteerAdapter as pup } from '../adapters/puppeteer-adapter/puppeteer-adapter';

interface Product {
  title: string;
  price: string;
  pricePerKg: string;
  quantity: string;
}

export const products = {
  async fetchProducts(): Promise<Product[]> {
    const browser = await pup.createBrowser();
    const products = await this.crawlWebsitesForProducts(browser);
    await pup.closeBrowser(browser);
    return products;
  },

  async crawlWebsitesForProducts(browser: puppeteer.Browser): Promise<Product[]> {
    const page = await browser.newPage();
    return await this.crawlRohlikForProducts(page);
  },

  async crawlRohlikForProducts(page: puppeteer.Page): Promise<Product[]> {
    const url = 'https://rohlik.cz';
    const inputSelector = '#searchGlobal';
    const submitSelector = '#searchForm button';
    const query = 'jahody';

    await pup.navigateTo(page, url);
    await pup.search(page, inputSelector, submitSelector, query);

    return await this.getProducts(page);
  },

  async getProducts(page: puppeteer.Page): Promise<Product[]> {
    await page.waitForSelector('.productCard__title');
    return await page.evaluate(() => {
      const productEls = Array.from(document.querySelectorAll('.productCard__wrapper'));
      return productEls.map((productEl) => {
        const title = productEl.querySelector('.productCard__title')?.textContent?.trim() || '';
        const pricePerKg = productEl.querySelector('.pricePerOffer')?.textContent?.trim() || '';
        const quantity = productEl.querySelector('.quantity')?.textContent?.trim() || '';
        const price = productEl.querySelector('.cardPrice .wrap .price')?.textContent?.trim() || '';
        const priceFraction =
          productEl.querySelector('.cardPrice .wrap .fraction')?.textContent?.trim() || '';
        const fullPrice = `${price}.${priceFraction}`;

        return {
          title,
          price: fullPrice,
          pricePerKg,
          quantity,
        };
      });
    });
  },
};

// function createProduct(productEl: Element): Product {
//   const title = getElementText(productEl, '.productCard__title');
//   const pricePerKg = getElementText(productEl, '.pricePerOffer');
//   const quantity = getElementText(productEl, '.quantity');
//   const price = getElementText(productEl, '.cardPrice .wrap .price');
//   const priceFraction = getElementText(productEl, '.cardPrice .wrap .fraction');
//   const fullPrice = `${price}.${priceFraction}`;

//   return {
//     title,
//     price: fullPrice,
//     pricePerKg,
//     quantity,
//   };
// }

// function getElementText(parentEl: Element, selector: string): string {
//   return parentEl.querySelector(selector)?.textContent?.trim() || '';
// }
