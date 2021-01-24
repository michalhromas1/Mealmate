import { PuppeteerAdapterConfig } from './puppeteer-adapter-config.model';

const navigationWaitUntil = 'networkidle2';

export const puppeteerAdapterConfig: PuppeteerAdapterConfig = {
  browser: {
    headless: false,
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
  },

  navigation: {
    waitUntil: navigationWaitUntil,
  },

  directNavigation: {
    waitUntil: navigationWaitUntil,
  },
};
