import { ElasticSearchService } from '../services/ElasticSearch'

// tslint:disable-next-line:no-empty-interface
interface ITodo {} // TODO

// tslint:disable:object-literal-sort-keys
// example: getStoredTradesAsBuckets(esService, 'XMR', 'RUNE', '2018-11-15', '2018-11-17', 'hour')
export async function getStoredTradesAsBuckets(
  esService: ElasticSearchService, amountDenom: string, priceDenom: string, from: string, to: string, interval: string,
): Promise<ITodo> {
  const result =
    await esService.client.search<ITodo>({ body: {
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
    })
  return result
}
