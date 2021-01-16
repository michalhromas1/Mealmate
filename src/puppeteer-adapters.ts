import * as puppeteer from 'puppeteer';
import { CONFIG } from './config';

export async function createBrowser(): Promise<puppeteer.Browser> {
  return await puppeteer.launch(CONFIG.browser);
}

export async function closeBrowser(browser: puppeteer.Browser): Promise<void> {
  await browser.close();
}

export async function createPage(browser: puppeteer.Browser): Promise<puppeteer.Page> {
  return await browser.newPage();
}

export async function navigate(page: puppeteer.Page, url: string): Promise<void> {
  await page.goto(url, CONFIG.directNavigation);
}

export async function clickAndNavigate(page: puppeteer.Page, selector: string): Promise<void> {
  await Promise.all([click(page, selector), waitForNavigation(page)]);
}

export async function click(page: puppeteer.Page, selector: string): Promise<void> {
  await page.click(selector);
}

export async function waitForNavigation(page: puppeteer.Page): Promise<void> {
  await page.waitForNavigation(CONFIG.navigation);
}

export async function type(page: puppeteer.Page, selector: string, text: string): Promise<void> {
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
}
