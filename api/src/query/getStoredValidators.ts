import { IStoredValidators } from 'thorchain-info-common/build/interfaces/stored'
import { ElasticSearchService } from '../services/ElasticSearch'

export async function getStoredValidators (esService: ElasticSearchService): Promise<IStoredValidators> {
  const { _source } =
    await esService.client.get<IStoredValidators>({ id: 'validators', index: 'blockchain', type: 'type' })
  return _source
}
