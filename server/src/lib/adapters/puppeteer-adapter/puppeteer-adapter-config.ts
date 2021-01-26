import { PuppeteerAdapterConfig } from './puppeteer-adapter.model';

const navigationWaitUntil = 'networkidle2';

export const puppeteerAdapterConfig: PuppeteerAdapterConfig = {
  browser: {
    headless: true,
  },

  page: {
    viewport: {
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
    },
    waitForSelector: {
      timeout: 6000,
    },
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
  },

  navigation: {
    waitUntil: navigationWaitUntil,
  },

  directNavigation: {
    waitUntil: navigationWaitUntil,
  },
};
