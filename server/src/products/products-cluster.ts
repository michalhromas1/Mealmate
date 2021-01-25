import * as puppeteer from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import { puppeteerAdapter as pup } from '../adapters/puppeteer-adapter/puppeteer-adapter';
import { CrawledWebsiteProductSelectors } from '../crawled-websites/crawled-websites.model';
import { puppeteerAdapterConfig } from './../adapters/puppeteer-adapter/puppeteer-adapter-config';
import { CrawledWebsite } from './../crawled-websites/crawled-websites.model';
import { Product, ProductResults, ProductVariant } from './products.model';

interface ClusterData {
  website: CrawledWebsite;
  query: string;
}

export class ProductsCluster {
  constructor(private websites: CrawledWebsite[], private queries: string[]) {}

  async fetchProducts(): Promise<Product[]> {
    return await this.searchForProducts();
  }

  private async searchForProducts(): Promise<Product[]> {
    const cluster: Cluster<ClusterData, void> = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_BROWSER,
      maxConcurrency: 2,
      puppeteerOptions: puppeteerAdapterConfig.browser,
    });

    const products: Product[] = this.queries.map((query) => ({ title: query, results: [] }));

    await cluster.task(async ({ page, data }) => {
      const { query, website } = data;

      const product = products.find((p) => p.title === query)!;

      await pup.configurePage(page);
      await pup.navigateTo(page, website.url);

      await pup.search(
        page,
        website.selectors.search.input,
        website.selectors.search.submit,
        query
      );

      const productVariants = await this.searchSingleWebsiteForProductVariants(
        page,
        website.selectors.product
      );

      product.results.push({
        website: website.url,
        variants: productVariants,
      });
    });

    cluster.on('taskerror', (err: any, data: ClusterData) => {
      console.log(`Error crawling ${data.website} for ${data.query}: ${err.message}`);
    });

    this.queries.forEach((query) => {
      this.websites.forEach((website) => {
        cluster.queue({ query, website });
      });
    });

    await cluster.idle();
    await cluster.close();

    return products;

    // const results: Product[] = [];

    // for (let i = 0; i < this.queries.length; i++) {
    //   const query = this.queries[i];
    //   const webResults = await this.searchWebsitesForProductVariants(query);
    //   results.push({
    //     title: query,
    //     results: webResults,
    //   });
    // }

    // return results;
  }

  private async searchWebsitesForProductVariants(query: string): Promise<ProductResults[]> {
    const promisesBrowsers = [];
    for (let i = 0; i < this.websites.length; i++) {
      const website = this.websites[i];
      promisesBrowsers.push(
        new Promise(async (resBrowser: (value: ProductResults) => void) => {
          const browser = await pup.createBrowser();
          const page = await pup.getFirstBrowserPage(browser);

          await pup.navigateTo(page, website.url);
          await pup.search(
            page,
            website.selectors.search.input,
            website.selectors.search.submit,
            query
          );

          const productVariants = await this.searchSingleWebsiteForProductVariants(
            page,
            website.selectors.product
          );

          await pup.closeBrowser(browser);

          resBrowser({
            website: website.url,
            variants: productVariants,
          });

          // return {
          //   website: website.url,
          //   variants: productVariants,
          // };
        })
      );
    }

    return await Promise.all(promisesBrowsers);
  }

  private async searchSingleWebsiteForProductVariants(
    page: puppeteer.Page,
    productSelectors: CrawledWebsiteProductSelectors
  ): Promise<ProductVariant[]> {
    let hasVariants = false;

    await Promise.race([
      pup.waitForSelector(page, productSelectors.title).then(() => (hasVariants = true)),
      pup.waitForSelector(page, productSelectors.noVariants),
    ]).catch(() => {});

    return hasVariants
      ? await this.getProductVariantsFromSingleWebsite(page, productSelectors)
      : [];
  }

  private async getProductVariantsFromSingleWebsite(
    page: puppeteer.Page,
    productSelectors: CrawledWebsiteProductSelectors
  ): Promise<ProductVariant[]> {
    const variantEls = await page.$$(productSelectors.variant);

    return Promise.all(
      variantEls.map(
        async (variantEl) => await this.getSingleProductVariant(variantEl, productSelectors)
      )
    );
  }

  private async getSingleProductVariant(
    variantEl: puppeteer.ElementHandle<Element>,
    productSelectors: CrawledWebsiteProductSelectors
  ): Promise<ProductVariant> {
    const price = await this.getProductVariantProperty(variantEl, productSelectors.price);
    const priceFraction = await this.getProductVariantProperty(
      variantEl,
      productSelectors.priceFraction
    );

    return {
      price: `${price}.${priceFraction}`,
      title: await this.getProductVariantProperty(variantEl, productSelectors.title),
      pricePerKg: await this.getProductVariantProperty(variantEl, productSelectors.pricePerKg),
      quantity: await this.getProductVariantProperty(variantEl, productSelectors.quantity),
    };
  }

  private async getProductVariantProperty(
    variantEl: puppeteer.ElementHandle<Element>,
    propertySelector: string
  ): Promise<string> {
    const fallback = '';
    const propertyEl = await variantEl.$(propertySelector);
    return propertyEl
      ? this.parseProperty(await pup.getProperty<string>(propertyEl, 'textContent', fallback))
      : fallback;
  }

  private parseProperty(property: string): string {
    return property.trim().replace(/  |\r\n|\n|\r/gm, '');
  }
}
