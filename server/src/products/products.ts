import * as puppeteer from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import { PuppeteerAdapter as Pup } from '../adapters/puppeteer-adapter/puppeteer-adapter';
import { puppeteerAdapterConfig } from '../adapters/puppeteer-adapter/puppeteer-adapter-config';
import { Eshop, EshopProductSelectors } from '../eshops/eshops.model';
import { Product, ProductVariant } from './products.model';

interface ClusterData {
  eshop: Eshop;
  query: string;
}

export class Products {
  constructor(private eshops: Eshop[], private queries: string[]) {}

  async fetchProducts(): Promise<Product[]> {
    return await this.searchForProducts();
  }

  private async searchForProducts(): Promise<Product[]> {
    const cluster: Cluster<ClusterData, void> = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_BROWSER,
      maxConcurrency: 3,
      puppeteerOptions: puppeteerAdapterConfig.browser,
    });

    const products: Product[] = this.queries.map((query) => ({ title: query, results: [] }));

    await cluster.task(async ({ page, data }) => {
      const { query, eshop: website } = data;

      const product = products.find((p) => p.title === query)!;

      await Pup.configurePage(page);
      await Pup.navigateTo(page, website.url);

      await Pup.search(
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
      console.log(`Error crawling ${data.eshop} for ${data.query}: ${err.message}`);
    });

    this.queries.forEach((query) => {
      this.eshops.forEach((website) => {
        cluster.queue({ query, eshop: website });
      });
    });

    await cluster.idle();
    await cluster.close();

    return products;
  }

  private async searchSingleWebsiteForProductVariants(
    page: puppeteer.Page,
    productSelectors: EshopProductSelectors
  ): Promise<ProductVariant[]> {
    let hasVariants = false;

    await Promise.race([
      Pup.waitForSelector(page, productSelectors.title).then(() => (hasVariants = true)),
      Pup.waitForSelector(page, productSelectors.noVariants),
    ]).catch(() => {});

    return hasVariants
      ? await this.getProductVariantsFromSingleWebsite(page, productSelectors)
      : [];
  }

  private async getProductVariantsFromSingleWebsite(
    page: puppeteer.Page,
    productSelectors: EshopProductSelectors
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
    productSelectors: EshopProductSelectors
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
      ? this.parseProperty(await Pup.getProperty<string>(propertyEl, 'textContent', fallback))
      : fallback;
  }

  private parseProperty(property: string): string {
    return property.trim().replace(/  |\r\n|\n|\r/gm, '');
  }
}
