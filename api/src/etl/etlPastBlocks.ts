import { IStoredStatus } from '../interfaces/stored'
import { ElasticSearchService } from '../services/ElasticSearch'
import { EtlService } from '../services/EtlService'
import { ParallelPromiseLimiter } from '../services/ParallelPromiseLimiter'
import { etlBlock } from './etlBlock'

/**
 * Checks for missing past blocks in database. If blocks are missing, extracts, transforms and loads them.
 * @param esService
 */
export async function etlPastBlocks (etlService: EtlService, esService: ElasticSearchService) {
  const limiter = new ParallelPromiseLimiter(10) // TODO: increase to 100
  let errorThrown = false

  try {
    const latestBlockHeight = await getLatestBlockHeight(esService)
    for (let height = latestBlockHeight; height >= 0; height--)  {
      if (await doesBlockExist(esService, height)) { continue }
      await limiter.push(() => etlBlock(etlService, esService, height), e => {
        if (!errorThrown) {
          errorThrown = true
          throw e
        }
      })
    }
  } catch (e) {
    console.error('Unexpected past blocks etl error, will restart etl service', e)
    // restart etl service
    etlService.stop()
    etlService.start()
  }
}

async function getLatestBlockHeight (esService: ElasticSearchService) {
  const result = await esService.client.get<IStoredStatus>({ id: 'status', index: 'blockchain', type: 'type' })
  return result._source.blockHeight
}

async function doesBlockExist (esService: ElasticSearchService, height: number) {
  return await esService.client.exists({ index: 'blocks', type: 'type', id: `${height}` })
}
