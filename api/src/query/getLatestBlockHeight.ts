import { IStoredStatus } from '../interfaces/stored'
import { ElasticSearchService } from '../services/ElasticSearch'

export async function getLatestBlockHeight (esService: ElasticSearchService) {
  const result = await esService.client.get<IStoredStatus>({ id: 'status', index: 'blockchain', type: 'type' })
  return result._source.blockHeight
}
