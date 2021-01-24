import * as puppeteer from 'puppeteer';
import { puppeteerAdapter as pup } from '../adapters/puppeteer-adapter/puppeteer-adapter';
import {
  CrawledWebsite,
  CrawledWebsiteProductSelectors,
} from '../crawled-websites/crawled-websites.model';
import { Product, ProductResults, ProductVariant } from './products.model';

export class Products {
  constructor(private websites: CrawledWebsite[], private queries: string[]) {}

  async fetchProducts(): Promise<Product[]> {
    return await this.searchForProducts();
  }

  private async searchForProducts(): Promise<Product[]> {
    const results: Product[] = [];

    for (let i = 0; i < this.queries.length; i++) {
      const query = this.queries[i];
      const webResults = await this.searchWebsitesForProductVariants(query);
      results.push({
        title: query,
        results: webResults,
      });
    }

    return results;
  }

  private async searchWebsitesForProductVariants(query: string): Promise<ProductResults[]> {
    const productVariantsOnWebsites: ProductResults[] = [];

    for (let i = 0; i < this.websites.length; i++) {
      const website = this.websites[i];

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

      productVariantsOnWebsites.push({
        website: website.url,
        variants: productVariants,
      });
    }

    return productVariantsOnWebsites;
  }

  // private async searchWebsitesForProductVariants(query: string): Promise<ProductResults[]> {
  //   const productVariantsOnWebsites: ProductResults[] = [];

  //   for (let i = 0; i < this.websites.length; i++) {
  //     const website = this.websites[i];

  //     const browser = await pup.createBrowser();
  //     const page = await pup.getFirstBrowserPage(browser);

  //     await pup.navigateTo(page, website.url);
  //     await pup.search(
  //       page,
  //       website.selectors.search.input,
  //       website.selectors.search.submit,
  //       query
  //     );

  //     const productVariants = await this.searchSingleWebsiteForProductVariants(
  //       page,
  //       website.selectors.product
  //     );

  //     await pup.closeBrowser(browser);

  //     productVariantsOnWebsites.push({
  //       website: website.url,
  //       variants: productVariants,
  //     });
  //   }

  //   return productVariantsOnWebsites;
  // }

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
    const variants: ProductVariant[] = [];
    const variantEls = await page.$$(productSelectors.variant);

    for (let i = 0; i < variantEls.length; i++) {
      const variant = await this.getSingleProductVariant(variantEls[i], productSelectors);
      variants.push(variant);
    }

    return variants;
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
