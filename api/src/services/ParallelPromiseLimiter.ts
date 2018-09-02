import { logger } from './logger'

/**
 * Service that lets you limit how many promises can be run in parallel. The push method should be awaited and will
 * return immediately until limit is reached. Once limit is reached, it will block until the number of promises has
 * reduced under the limit and will then continue to return immediately again. The promise pushed into the limiter
 * should handle it's errors with catch block.
 */
export class ParallelPromiseLimiter {
  private promises = new Set()

  constructor(private limit: number) { }

  public async push (promiseFn: () => Promise<any>) {
    await this.blockUntilUnderLimit()

    this.track(promiseFn)
  }

  private async blockUntilUnderLimit () {
    if (this.promises.size >= this.limit) {
      logger.debug(`ParallelPromiseLimiter will block, promise size: ${this.promises.size}, limit: ${this.limit}`)
      await Promise.race(this.promises)
      await this.blockUntilUnderLimit()
    } else {
      logger.debug(`ParallelPromiseLimiter will not block, promise size: ${this.promises.size}, limit: ${this.limit}`)
    }
  }

  private async track (promiseFn: () => Promise<any>) {
    const promise = promiseFn()

    this.promises.add(promise)
    await promise
    this.promises.delete(promise)
  }
}
