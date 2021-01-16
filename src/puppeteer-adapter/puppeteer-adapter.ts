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
    return await browser.newPage();
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
    await puppeteerAdapter.typeInto(page, inputSelector, query);
    await puppeteerAdapter.clickAndNavigate(page, submitSelector);
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
};
