import * as puppeteer from 'puppeteer';
import { puppeteerAdapter as pup } from './puppeteer-adapter/puppeteer-adapter';

export const app = {
  async run(): Promise<void> {
    const browser = await pup.createBrowser();
    await this.browseAllWebsites(browser);
    await pup.closeBrowser(browser);
  },

  async browseAllWebsites(browser: puppeteer.Browser): Promise<void> {
    const page = await browser.newPage();
    await this.browseRohlik(page);
  },

  async browseRohlik(page: puppeteer.Page): Promise<void> {
    const url = 'https://rohlik.cz';
    const inputSelector = '#searchGlobal';
    const submitSelector = '#searchForm button';
    const query = 'jahody';

    await pup.navigateTo(page, url);
    await pup.search(page, inputSelector, submitSelector, query);

    await this.listProducts(page);
  },

  async listProducts(page: puppeteer.Page): Promise<void> {
    await page.waitForSelector('.productCard__title');
    const products = await page.evaluate(() => {
      const productEls = document.querySelectorAll('.productCard__wrapper');
      // const pps: any[] = [];
      // productEls.forEach((p) => {
      //   pps.push({
      //     title: p.querySelector('.productCard__title')?.textContent,
      //     price: p.querySelector('.cardPrice')?.textContent,
      //     pricePerKg: p.querySelector('.pricePerOffer')?.textContent,
      //     quantity: p.querySelector('.quantity')?.textContent,
      //   });
      // });

      const ps = Array.from(productEls).map((p) => ({
        title: p.querySelector('.productCard__title')?.textContent?.trim(),
        price: `${p
          .querySelector('.cardPrice .wrap .price')
          ?.textContent?.trim()}.${p
          .querySelector('.cardPrice .wrap .fraction')
          ?.textContent?.trim()}`,
        pricePerKg: p.querySelector('.pricePerOffer')?.textContent?.trim(),
        quantity: p.querySelector('.quantity')?.textContent?.trim(),
      }));

      return ps;
    });
    console.log(products);
  },
};
