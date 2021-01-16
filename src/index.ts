import * as puppeteer from 'puppeteer';
import {
  clickAndNavigate,
  closeBrowser,
  createBrowser,
  navigate as navigateTo,
  type as typeInto,
} from './puppeteer-adapters';

(async () => {
  const browser = await createBrowser();
  await browseAll(browser);
  await closeBrowser(browser);
})();

async function browseAll(browser: puppeteer.Browser): Promise<void> {
  const page = await browser.newPage();
  await browseRohlik(page);
}

async function browseRohlik(page: puppeteer.Page): Promise<void> {
  const url = 'https://rohlik.cz';
  const inputSelector = '#searchGlobal';
  const submitSelector = '#searchForm button';
  const query = 'losos';

  await navigateTo(page, url);
  await search(page, inputSelector, submitSelector, query);
  await page.waitForTimeout(10000);
}

async function search(
  page: puppeteer.Page,
  inputSelector: string,
  submitSelector: string,
  query: string
): Promise<void> {
  await typeInto(page, inputSelector, query);
  await clickAndNavigate(page, submitSelector);
}
