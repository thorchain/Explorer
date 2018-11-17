import { IExchangePair } from 'thorchain-info-common/src/interfaces/metrics'
import { ElasticSearchService } from '../services/ElasticSearch'

// tslint:disable:object-literal-sort-keys
// example: getStoredTradesAsBuckets(esService, 'XMR', 'RUNE', 'now-24h')
export async function getStoredTradeAggsSince(
  esService: ElasticSearchService, amountDenom: string, priceDenom: string, since: string,
): Promise<IExchangePair> {
  const result = await esService.client.search({
    body: {
      size: 0,
      aggs: {
        singleDenom: {
          filter: {
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
                {
                  range: {
                    time: {
                      gte: since,
                    },
                  },
                },
              ],
            },
          },
          aggs: {
            high: {
              max: {
                field: 'price.amount',
              },
            },
            low: {
              min: {
                field: 'price.amount',
              },
            },
            amount: {
              sum: {
                field: 'amount.amount',
              },
            },
            avg: {
              avg: {
                field: 'price.amount',
              },
            },
            open: {
              top_hits: {
                size: 1,
                _source: {
                  includes: 'price.amount',
                },
                sort: [
                  {
                    height: {
                      order: 'asc',
                    },
                  },
                  {
                    index: {
                      order: 'asc',
                    },
                  },
                ],
              },
            },
            close: {
              top_hits: {
                size: 1,
                _source: {
                  includes: 'price.amount',
                },
                sort: [
                  {
                    height: {
                      order: 'desc',
                    },
                  },
                  {
                    index: {
                      order: 'desc',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    index: 'trades', type: 'type',
  }) as ITradeAggsSince

  if (result.aggregations.singleDenom.doc_count === 0) {
    // no matches in last 24 hours, search for last price and return that instead
    const result2 = await esService.client.search<any>({
      body: {
        size: 1,
        query: {
          bool: {
            must: [
              {
                term: {
                  'price.denom.keyword': priceDenom,
                },
              },
              {
                'term': {
                  'amount.denom.keyword': amountDenom,
                },
              },
              {
                range: {
                  time: {
                    lt: since,
                  },
                },
              },
            ],
          },
        },
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
      },
      index: 'trades', type: 'type',
    }) as any as ITradeBefore

    if (result2.hits.total === 0) {
      return {
        c: 0,
        o: 0,
        h: 0,
        l: 0,
        v: 0,
      }
    }

    const lastPrice = parseInt(result2.hits.hits[0]._source.price.amount, 10)

    return {
      c: lastPrice,
      o: lastPrice,
      h: lastPrice,
      l: lastPrice,
      v: 0,
    }
  }

  return {
    c: parseInt(result.aggregations.singleDenom.close.hits.hits[0]._source.price.amount, 10),
    o: parseInt(result.aggregations.singleDenom.open.hits.hits[0]._source.price.amount, 10),
    h: result.aggregations.singleDenom.high.value || 0,
    l: result.aggregations.singleDenom.low.value || 0,
    v: result.aggregations.singleDenom.amount.value * (result.aggregations.singleDenom.avg.value || 0),
  }
}

interface ITradeAggsSince {
  took: number,
  timed_out: boolean,
  '_shards': {
    'total': number,
    'successful': number,
    'skipped': number,
    'failed': number,
  },
  'hits': {
    'total': number,
    'max_score': number,
    'hits': [],
  },
  'aggregations': {
    'singleDenom': {
      'meta': {},
      'doc_count': number,
      'amount': {
        'value': number,
      },
      'high': {
        'value': number | null,
      },
      'low': {
        'value': number | null,
      },
      'avg': {
        'value': number | null,
      },
      'close': {
        'hits': {
          'total': number,
          'max_score': number,
          'hits': Array<{
            '_index': 'trades',
            '_type': 'type',
            '_id': string,
            '_score': null,
            '_source': {
              'price': {
                'amount': string,
              },
            },
            'sort': [
              number,
              number
            ],
          }>,
        },
      },
      'open': {
        'hits': {
          'total': number,
          'max_score': number,
          'hits': Array<{
            '_index': 'trades',
            '_type': 'type',
            '_id': string,
            '_score': null,
            '_source': {
              'price': {
                'amount': string,
              },
            },
            'sort': [
              number,
              number
            ],
          }>,
        },
      },
    },
  }
}

interface ITradeBefore {
  'took': number,
  'timed_out': boolean,
  '_shards': {
    'total': number,
    'successful': number,
    'skipped': number,
    'failed': number,
  },
  'hits': {
    'total': number,
    'max_score': number,
    'hits': Array<{
      '_index': 'trades',
      '_type': 'type',
      '_id': string,
      '_score': number,
      '_source': {
        'amount': {
          'denom': string,
          'amount': string,
        },
        'height': number,
        'index': number,
        'maker_order_id': number,
        'price': {
          'denom': string,
          'amount': string,
        },
        'taker_order_id': number,
        'time': string,
      },
      'sort': [
        number,
        number
      ],
    }>,
  }
}
