import * as puppeteer from 'puppeteer';
import { puppeteerAdapterConfig as paConfig } from './puppeteer-adapter-config';

export const puppeteerAdapter = {
  async createBrowser(): Promise<puppeteer.Browser> {
    return await puppeteer.launch(paConfig.browser);
  },

  async closeBrowser(browser: puppeteer.Browser): Promise<void> {
    await browser.close();
  },

  async createPage(browser: puppeteer.Browser): Promise<puppeteer.Page> {
    const page = await browser.newPage();
    await this.configurePage(page);
    return page;
  },

  async getFirstBrowserPage(browser: puppeteer.Browser): Promise<puppeteer.Page> {
    const page = (await browser.pages())[0];
    await this.configurePage(page);
    return page;
  },

  async configurePage(page: puppeteer.Page): Promise<puppeteer.Page> {
    await page.setUserAgent(paConfig.page.userAgent);
    await page.setViewport(paConfig.page.viewport);
    await this.disableImageLoad(page);
    return page;
  },

  async disableImageLoad(page: puppeteer.Page): Promise<void> {
    await page.setRequestInterception(true);

    page.on('request', (request) => {
      const resourceType = request.resourceType();
      const shouldCancelRequest = resourceType === 'image';
      if (shouldCancelRequest) request.abort();
      else request.continue();
    });
  },

  async navigateTo(page: puppeteer.Page, url: string): Promise<void> {
    await page.goto(url, paConfig.directNavigation);
  },

  async search(
    page: puppeteer.Page,
    inputSelector: string,
    submitSelector: string,
    query: string
  ): Promise<void> {
    console.log('1.1');
    await puppeteerAdapter.typeInto(page, inputSelector, query);
    console.log('1.2');
    await puppeteerAdapter.clickAndNavigate(page, submitSelector);
    console.log('1.3');
  },

  async clickAndNavigate(page: puppeteer.Page, selector: string): Promise<void> {
    await Promise.all([this.clickOn(page, selector), this.waitForNavigation(page)]);
  },

  async clickOn(page: puppeteer.Page, selector: string): Promise<void> {
    await page.click(selector);
  },

  async waitForNavigation(page: puppeteer.Page): Promise<void> {
    await page.waitForNavigation(paConfig.navigation);
  },

  async typeInto(page: puppeteer.Page, selector: string, text: string): Promise<void> {
    // Fix for page.type() lag - https://github.com/puppeteer/puppeteer/issues/1648#issuecomment-439483004
    await page.evaluate(
      (selector: string, text: string) => {
        const inputElement = document.querySelector(selector);
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;
        nativeInputValueSetter?.call(inputElement, text);

        const ev2 = new Event('input', { bubbles: true });
        inputElement?.dispatchEvent(ev2);
      },
      selector,
      text
    );
  },

  async getProperty<T>(
    element: puppeteer.ElementHandle<Element>,
    property: string,
    fallback: T
  ): Promise<T> {
    return ((await (await element?.getProperty(property))?.jsonValue()) as T) || fallback;
  },

  async waitForSelector(
    page: puppeteer.Page,
    selector: string
  ): Promise<puppeteer.ElementHandle<Element>> {
    return await page.waitForSelector(selector, paConfig.page.waitForSelector);
  },
};
