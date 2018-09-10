import { cache } from '../cache/cache'
import { sleep } from '../helpers/sleep'
import { ElasticSearchService } from '../services/ElasticSearch'
import { EtlService } from '../services/EtlService'
import { logger } from '../services/logger'
import { ParallelPromiseLimiter } from '../services/ParallelPromiseLimiter'
import { etlBlock } from './etlBlock'

/**
 * Checks first for blocks that should be loaded in cache, and then for missing past blocks in database. If blocks
 * are missing, extracts, transforms and loads them.
 * Returns a disposer (to abort the loop) and a promise (to await the function)
 * @param esService
 */
export function etlPastBlocks (etlService: EtlService, esService: ElasticSearchService) {
  logger.debug('etlPastBlocks called')

  const state = { cancelled: false }

  return {
    disposer: () => {
      logger.debug('etlPastBlocks.disposer called')
      state.cancelled = true
    },
    promise: doEtlPastBlocks(etlService, esService, state),
  }
}

async function doEtlPastBlocks (
  etlService: EtlService, esService: ElasticSearchService, state: { cancelled: boolean },
) {
  const limiter = new ParallelPromiseLimiter(100)

  function onError(e: Error) {
    logger.error('Unexpected blocks to etl for database error, will retry', e)
  }

  while (true) {
    if (state.cancelled) { return }

    if (cache.blocksToEtl.length > 0) {
      const height = cache.blocksToEtl.pop()!
      logger.debug('Found blocks to etl in cache, get block at height ' + height)
      await limiter.push(() => etlBlock(etlService, esService, height).catch((e) => {
        logger.error('Unexpected blocks to etl from cache error, will add the block back to cache', e)
        cache.blocksToEtl.push(height)
      }))
    } else if (cache.earliestBlockHeightCheckedInDatabase !== null && cache.earliestBlockHeightCheckedInDatabase > 1) {
      const height = cache.earliestBlockHeightCheckedInDatabase - 1
      logger.debug('No blocks to etl in cache, check if past block exists in db at height ' + height)
      try {
        const blockExists = await doesBlockExist(esService, height)
        if (blockExists) { continue }
      } catch (e) {
        logger.error('Could not check whether block exists, will retry after 500 ms', e)
        await sleep(500)
        continue
      }
      logger.debug(`Does not yet exist in db at height ${height}, schedule etl`)
      await limiter.push(() => etlBlock(etlService, esService, height).catch(onError))
      cache.earliestBlockHeightCheckedInDatabase--
    } else {
      // nothing to do, sleep a bit and try again
      await sleep(100)
    }
  }
}

async function doesBlockExist (esService: ElasticSearchService, height: number) {
  return await esService.client.exists({ index: 'blocks', type: 'type', id: `${height}` })
}
