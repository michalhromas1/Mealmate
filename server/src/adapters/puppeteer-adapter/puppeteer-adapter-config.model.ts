import * as puppeteer from 'puppeteer';

export interface PuppeteerAdapterConfig {
  browser: puppeteer.LaunchOptions | undefined;
  navigation: puppeteer.NavigationOptions | undefined;
  directNavigation: puppeteer.DirectNavigationOptions | undefined;
  page: {
    viewport: puppeteer.Viewport;
  };
}
