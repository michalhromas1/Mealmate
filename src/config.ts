import * as puppeteer from 'puppeteer';

export interface Config {
  browser: puppeteer.LaunchOptions | undefined;
  navigation: puppeteer.NavigationOptions | undefined;
  directNavigation: puppeteer.DirectNavigationOptions | undefined;
}

const navigationWaitUntil = 'networkidle2';

export const CONFIG: Config = {
  browser: {
    headless: false,
  },
  navigation: {
    waitUntil: navigationWaitUntil,
  },
  directNavigation: {
    waitUntil: navigationWaitUntil,
  },
};
