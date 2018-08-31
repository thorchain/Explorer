/**
 * Service that lets you limit how many promises can be run in parallel. The push method should be awaited and will
 * return immediately until limit is reached. Once limit is reached, it will block until the number of promises has
 * reduced under the limit and will then continue to return immediately again.
 */
export class ParallelPromiseLimiter {
  private promises = new Set()

  constructor(private limit: number) { }

  public async push (promiseFn: () => Promise<any>, errorHandler: (e: Error) => void) {
    await this.blockUntilUnderLimit()
    this.track(promiseFn, errorHandler)
  }

  private async blockUntilUnderLimit () {
    if (this.promises.size >= this.limit) {
      // console.log('Will block, promise size:', this.promises.size, 'limit:', this.limit)
      try {
        await Promise.race(this.promises)
      } catch (e) {
        // do not handle here, already handled in this.track below
      }
      await this.blockUntilUnderLimit()
    }
  }

  private async track (promiseFn: () => Promise<any>, errorHandler: (e: Error) => void) {
    let promise
    try {
      promise = promiseFn()
      this.promises.add(promise)
      // console.log('Added promise, size:', this.promises.size)
      await promise
      // console.log('Removed promise, size:', this.promises.size)
    } catch (e) {
      errorHandler(e)
    }
    this.promises.delete(promise)
  }
}
