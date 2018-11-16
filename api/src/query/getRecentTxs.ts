import { IStoredRecentTx } from 'thorchain-info-common/build/interfaces/stored'
import { ElasticSearchService } from '../services/ElasticSearch'

export async function getRecentTxs (esService: ElasticSearchService, size: number): Promise<IStoredRecentTx[]> {
  const { hits: { hits } } =
    await esService.client.search<IStoredRecentTx>({ body: {
      from: 0,
      size,
      sort: [
        { height: 'desc' },
        { index: 'desc' },
      ],
    }, index: 'recent-txs', type: 'type' })

  return hits.map(hit => hit._source)
}
