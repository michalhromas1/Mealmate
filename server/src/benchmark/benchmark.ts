export class Benchmark {
  private static units: string = 'ms';

  static async measure<T>(tryCount: number, subject: () => T): Promise<T> {
    this.printStart();

    let totalTime = 0;
    let response: T;

    for (let i = 0; i < tryCount; i++) {
      const startTime = Date.now();

      response = await subject();

      const duration = this.getDuration(startTime);

      totalTime += duration;
      this.printDuration(i + 1, duration);
    }

    const average = this.calculateAverage(totalTime, tryCount);
    this.printEnd(average);

    return response!;
  }

  private static printStart(): void {
    console.log('Benchmark started...');
  }

  private static printEnd(average: number): void {
    this.printAverage(average);
    console.log('Benchmark finished');
  }

  private static printDuration(index: number, duration: number): void {
    console.log(`${index}: ${duration} ${this.units}`);
  }

  private static printAverage(average: number): void {
    console.log(`Avg: ${average} ${this.units}`);
  }

  private static getDuration(startTime: number): number {
    return Date.now() - startTime;
  }

  private static calculateAverage(itemSum: number, itemCount: number): number {
    return itemSum / itemCount;
  }
}
