import { IStoredStatus } from '../interfaces/stored'
import { ElasticSearchService } from '../services/ElasticSearch'
import { EtlService } from '../services/EtlService'
import { etlBlock } from './etlBlock'

/**
 * Checks for missing past blocks in database. If blocks are missing, extracts, transforms and loads them.
 * @param esService
 */
export async function etlPastBlocks (etlService: EtlService, esService: ElasticSearchService) {
  try {
    const latestBlockHeight = await getLatestBlockHeight(esService)
    for (let height = latestBlockHeight; height >= 0; height--)  {
      if (await doesBlockExist(esService, height)) { continue }
      await etlBlock(esService, height)
    }
  } catch (e) {
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
