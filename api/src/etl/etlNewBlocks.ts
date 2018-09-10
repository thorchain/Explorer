import { sleep } from '../helpers/sleep'
import { getLatestBlockHeight } from '../query/getLatestBlockHeight'
import { ElasticSearchService } from '../services/ElasticSearch'
import { EtlService } from '../services/EtlService'
import { logger } from '../services/logger'
import { etlBlock } from './etlBlock'

/**
 * Subscribes tendermint websocket service for new blocks, extracts, transforms and loads them. Returns a callback
 * to unsubscribe the subscribed resources
 */
export function etlNewBlocks (etlService: EtlService, esService: ElasticSearchService) {
  logger.debug('etlNewBlock called')

  const state = { cancelled: false }

  return {
    disposer: () => {
      logger.debug('etlPastBlocks.disposer called')
      state.cancelled = true
    },
    promise: doEtlNewBlocks(etlService, esService, state),
  }
}

async function doEtlNewBlocks (
  etlService: EtlService, esService: ElasticSearchService, state: { cancelled: boolean },
) {
  const latestBlockHeight = await getLatestBlockHeight(esService)

  let heightToFetch = latestBlockHeight + 1
  while (!state.cancelled) {
    logger.debug('get new block at height ' + heightToFetch)
    try {
      await etlBlock(etlService, esService, heightToFetch)
      await sleep(100)
      heightToFetch++
    } catch (e) {
      // TODO expect that sometimes blocks are not yet produced?
      logger.warn('Unexpected new block etl error, will restart etl service', e)
      // restart etl service
      etlService.stop()
      etlService.start()
    }
  }
}
