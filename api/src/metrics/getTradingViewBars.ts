import * as moment from 'moment'
import { ITradingViewBars, ITradingViewBarsOk, ITradingViewBarsParams } from 'thorchain-info-common/src/interfaces/metrics'
import { ElasticSearchService } from '../services/ElasticSearch'
import { getStoredTradesAsBuckets } from '../query/getStoredTradeAggsInBuckets';

export async function getTradingViewBars(esService: ElasticSearchService, params: ITradingViewBarsParams):
  Promise<ITradingViewBars> {

  const { symbol, from, to, resolution } = params

  let interval = 'day'

  if (resolution === '1D' || resolution === 'D') {
    interval = 'day'
  } else if (resolution === '1') {
    interval = 'minute'
  }

  if (!symbol) {
    return {
      errmsg: 'Ticker not defined',
      s: 'error',
    }
  }

  const { aggregations: { singleDenom: { buckets: { buckets } } } } = await getStoredTradesAsBuckets(
    esService,
    symbol,
    'RUNE',
    moment.unix(Number(from)).format(),
    moment.unix(Number(to)).format(),
    interval,
  )

  if (buckets.length === 0) {
    return {
      s: 'no_data',
      nextTime: 0
    }
  }

  const bars = {
    s: 'ok',
    t: [],
    c: [],
    o: [],
    h: [],
    l: [],
  } as ITradingViewBarsOk

  buckets.forEach((bucket) => {
    if (bucket.doc_count === 0) {
      return
    }

    bars.t.push((Math.floor(bucket.key / 1000)))
    bars.c.push(Number(bucket.close.hits.hits[0]._source.price.amount))
    bars.o!.push(Number(bucket.open.hits.hits[0]._source.price.amount))
    bars.h!.push(Number(bucket.high.value))
    bars.l!.push(Number(bucket.low.value))
  })


  return bars
}
