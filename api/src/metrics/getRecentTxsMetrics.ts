import { IStoredRecentTx } from '../interfaces/stored'
import { getRecentTxs } from '../query/getRecentTxs'
import { ElasticSearchService } from '../services/ElasticSearch'

export async function getRecentTxsMetrics(esService: ElasticSearchService, size: number):
  Promise<IStoredRecentTx[]> {
  return await getRecentTxs(esService, size)
}
