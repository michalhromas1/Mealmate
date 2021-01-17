import { PuppeteerAdapterConfig } from './puppeteer-adapter-config-model';

const navigationWaitUntil = 'networkidle2';

export const puppeteerAdapterConfig: PuppeteerAdapterConfig = {
  browser: {
    headless: true,
  },

  navigation: {
    waitUntil: navigationWaitUntil,
  },

  directNavigation: {
    waitUntil: navigationWaitUntil,
  },
};
