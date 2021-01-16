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
    const query = 'losos';

    await pup.navigateTo(page, url);
    await pup.search(page, inputSelector, submitSelector, query);
    await page.waitForTimeout(10000);
  },
};
