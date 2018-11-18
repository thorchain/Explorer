
import { ITradingViewBars, ITradingViewBarsParams } from 'thorchain-info-common/src/interfaces/metrics'
import { ElasticSearchService } from '../services/ElasticSearch'

export async function getTradingViewBars(esService: ElasticSearchService, params: ITradingViewBarsParams):
  Promise<ITradingViewBars> {

  // TODO: to be implemented by Haneef, see ../query/getStoredTradesAsBuckets.ts for querying data

  return {
    errmsg: 'Ticker not found',
    s: 'error',
  }
}
