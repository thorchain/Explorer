import { IStoredStatus } from 'thorchain-info-common/src/interfaces/stored'
import { ElasticSearchService } from '../services/ElasticSearch'

export async function getStoredStatus (esService: ElasticSearchService): Promise<IStoredStatus> {
  const { _source } =
    await esService.client.get<IStoredStatus>({ id: 'status', index: 'blockchain', type: 'type' })
  return _source
}
