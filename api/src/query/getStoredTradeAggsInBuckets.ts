import { ElasticSearchService } from '../services/ElasticSearch'

// tslint:disable:object-literal-sort-keys
// example: getStoredTradesAsBuckets(esService, 'XMR', 'RUNE', '2018-11-15', '2018-11-17', 'hour')
export async function getStoredTradesAsBuckets(
  esService: ElasticSearchService, amountDenom: string, priceDenom: string, from: string, to: string, interval: string,
): Promise<ITradeAggsInBuckets> {
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
                        gte: from,
                        lt: to,
                      },
                    },
                  },
                ],
              },
            },
            aggs: {
              buckets: {
                date_histogram: {
                  field: 'time',
                  interval,
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
        },
      },
      index: 'trades', type: 'type',
    }) as ITradeAggsInBuckets
  return result
}

export interface ITradeAggsInBuckets {
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
      'buckets': {
        'buckets': Array<{
          'key_as_string': string,
          'key': number,
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
        }>,
      },
    },
  }
}
