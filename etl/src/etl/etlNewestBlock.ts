
import { cache } from '../cache/cache'
import { sleep } from '../helpers/sleep'
import { ElasticSearchService } from '../services/ElasticSearch'
import { EtlService } from '../services/EtlService'
import { logger } from '../services/logger'
import { etlBlock } from './etlBlock'

export function etlNewestBlock (etlService: EtlService, esService: ElasticSearchService) {
  logger.debug('etlNewestBlock called')

  const state = { cancelled: false }

  return {
    disposer: () => {
      logger.debug('etlNewestBlock.disposer called')
      state.cancelled = true
    },
    promise: doEtlNewestBlock(etlService, esService, state),
  }
}

async function doEtlNewestBlock (
  etlService: EtlService, esService: ElasticSearchService, state: { cancelled: boolean },
) {
  while (!state.cancelled) {
    logger.debug('get newest block')
    try {
      const newHeight = await etlBlock(etlService, esService, null)
      logger.debug('got newest block with height ' + newHeight)

      if (cache.latestBlockHeight !== null) {
        // add blocks that should be processed to blocksToEtl
        for (let i = cache.latestBlockHeight + 1; i < newHeight; i++) { cache.blocksToEtl.push(i) }
        logger.debug(`added entries to blocksToEtl between ${cache.latestBlockHeight + 1} and ${newHeight - 1}`)
      }
      cache.latestBlockHeight = newHeight
      if (cache.earliestBlockHeightCheckedInDatabase === null) {
        cache.earliestBlockHeightCheckedInDatabase = cache.latestBlockHeight
      }

      await sleep(500)
    } catch (e) {
      logger.error('Unexpected new block etl error', e)
      await sleep(500)
    }
  }
}
