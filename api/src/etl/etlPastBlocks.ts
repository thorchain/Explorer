import { IStoredStatus } from '../interfaces/stored'
import { ElasticSearchService } from '../services/ElasticSearch'
import { EtlService } from '../services/EtlService'
import { logger } from '../services/logger'
import { ParallelPromiseLimiter } from '../services/ParallelPromiseLimiter'
import { etlBlock } from './etlBlock'

/**
 * Checks for missing past blocks in database. If blocks are missing, extracts, transforms and loads them.
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
  const limiter = new ParallelPromiseLimiter(10) // TODO: increase to 100

  function onError(e: Error) {
    logger.warn('Unexpected past blocks etl error, will restart etl service', e)
    // restart etl service
    etlService.stop()
    etlService.start()
  }

  const latestBlockHeight = await getLatestBlockHeight(esService)
  // TODO find a better way to fill all gaps, for now we just check the last 24 hours (~ 24*60*60/6 = 14,400),
  // which should take around 1.5 minutes
  for (let height = latestBlockHeight; height >= latestBlockHeight - 14400; height--)  {
    if (state.cancelled) { return }
    logger.debug('check if past block exists at height ' + height)
    const blockExists = await doesBlockExist(esService, height)
    if (blockExists) { continue }
    logger.debug('get past block at height ' + height)
    await limiter.push(() => etlBlock(etlService, esService, height).catch(onError))
  }
  logger.debug('etlPastBlocks done')
}

async function getLatestBlockHeight (esService: ElasticSearchService) {
  const result = await esService.client.get<IStoredStatus>({ id: 'status', index: 'blockchain', type: 'type' })
  return result._source.blockHeight
}

async function doesBlockExist (esService: ElasticSearchService, height: number) {
  return await esService.client.exists({ index: 'blocks', type: 'type', id: `${height}` })
}
