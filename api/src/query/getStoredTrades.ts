import { IStoredLimitOrder, IStoredTrade } from 'thorchain-info-common/src/interfaces/stored'
import { ElasticSearchService } from '../services/ElasticSearch'

export async function getStoredTrades (
  esService: ElasticSearchService, amountDenom: string, priceDenom: string, size: number, account?: string,
): Promise<IStoredTrade[]> {
  let bool

  if (account) {
    const limOrds = await esService.client.search<IStoredLimitOrder>({ body: {
      query: {
        term: {
          'sender.keyword': {
            value: account,
          },
        },
      },
      size: size * 10,
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
    }, index: 'limit-orders', type: 'type' })
    const orderIds = limOrds.hits.hits.map(hit => hit._source.order_id)
    bool = {
      minimum_should_match: 1,
      should: [
        {
          terms: {
            maker_order_id: orderIds,
          },
        },
        {
          terms: {
            taker_order_id: orderIds,
          },
        },
      ],
    }
  }

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
          ...bool,
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
