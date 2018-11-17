import { IStoredTrade } from 'thorchain-info-common/src/interfaces/stored'
import { ElasticSearchService } from '../services/ElasticSearch'

export async function getStoredTrades (
  esService: ElasticSearchService, amountDenom: string, priceDenom: string, size: number,
): Promise<IStoredTrade[]> {
  const { hits: { hits } } =
    await esService.client.search<IStoredTrade>({ body: {
      query: {
        bool: {
          must: [
            {
              term: {
                'price.denom.keyword': priceDenom,
              },
            },
            {
              term: {
                'amount.denom.keyword': amountDenom,
              },
            },
          ],
        },
      },
      size,
      sort: [
        {
          height: {
            order: 'desc',
          },
          index: {
            order: 'desc',
          },
        },
      ],
    }, index: 'trades', type: 'type' })

  return hits.map(hit => hit._source)
}
