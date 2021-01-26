import { Cluster } from 'puppeteer-cluster';
import { TaskFunction } from 'puppeteer-cluster/dist/Cluster';
import { puppeteerAdapterConfig } from '../../lib/adapters/puppeteer-adapter/puppeteer-adapter-config';

export class ClusterAdapter {
  static async launch<ClusterData, Response>(): Promise<Cluster<ClusterData, Response>> {
    return await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_BROWSER,
      maxConcurrency: 3,
      puppeteerOptions: puppeteerAdapterConfig.browser,
    });
  }

  static async addTask<ClusterData, Response>(
    cluster: Cluster<ClusterData, Response>,
    task: TaskFunction<ClusterData, Response>
  ): Promise<void> {
    await cluster.task(task);
  }
}
