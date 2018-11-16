import { IStoredGenesis } from 'thorchain-info-common/build/interfaces/stored'
import { ElasticSearchService } from '../services/ElasticSearch'

export async function getStoredGenesis (esService: ElasticSearchService): Promise<IStoredGenesis> {
  const { _source } =
    await esService.client.get<IStoredGenesis>({ id: 'genesis', index: 'blockchain', type: 'type' })
  return _source
}
