import * as puppeteer from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import { PuppeteerAdapter as Pup } from '../../lib/adapters/puppeteer-adapter/puppeteer-adapter';
import { puppeteerAdapterConfig } from '../../lib/adapters/puppeteer-adapter/puppeteer-adapter-config';
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
        eshop: website.url,
        variants: productVariants,
      });
    });

    cluster.on('taskerror', (err: any, data: ClusterData) => {
      console.log(`Error crawling ${data.eshop.url} for ${data.query}: ${err.message}`);
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
    return {
      title: await this.getProductVariantProperty(variantEl, productSelectors.title),
      image: await this.getProductVariantProperty(variantEl, productSelectors.image, 'currentSrc'),
      link: await this.getProductVariantProperty(variantEl, productSelectors.link, 'href'),
      ...(await this.getUnitPriceInfo(
        variantEl,
        productSelectors.unitPrice,
        productSelectors.unitDelimeter
      )),
    };
  }

  private async getUnitPriceInfo(
    variantEl: puppeteer.ElementHandle<Element>,
    selector: string,
    delimeter: string
  ): Promise<{ unit: string; unitPrice: string; currency: string }> {
    const unitPriceInfo = await this.getProductVariantProperty(variantEl, selector);
    const unitPriceParts = unitPriceInfo.split(delimeter);

    const priceAndCurrency = unitPriceParts[0].replace(',', '.').replace(/\s/g, '');
    const unitPrice = parseFloat(priceAndCurrency).toString();
    const currency = priceAndCurrency.replace(/[0-9]/g, '').replace(/[.]/g, '');
    const unit = unitPriceParts[unitPriceParts.length - 1];

    return {
      unit: this.parseProperty(unit),
      unitPrice: this.parseProperty(unitPrice),
      currency: this.parseProperty(currency),
    };
  }

  private async getProductVariantProperty(
    variantEl: puppeteer.ElementHandle<Element>,
    propertySelector: string,
    property: string = 'textContent'
  ): Promise<string> {
    const fallback = '';
    const propertyEl = await variantEl.$(propertySelector);
    return propertyEl
      ? this.parseProperty(await Pup.getProperty<string>(propertyEl, property, fallback))
      : fallback;
  }

  private parseProperty(property: string): string {
    return property.trim().replace(/  |\r\n|\n|\r/gm, '');
  }
}
