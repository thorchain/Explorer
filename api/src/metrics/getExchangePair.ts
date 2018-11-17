import { IExchangePair, IExchangePairParams } from 'thorchain-info-common/src/interfaces/metrics'
import { getStoredTradeAggsSince } from '../query/getStoredTradeAggsSince'
import { ElasticSearchService } from '../services/ElasticSearch'

export async function getExchangePair(esService: ElasticSearchService, params: IExchangePairParams):
  Promise<IExchangePair> {
    return await getStoredTradeAggsSince(esService, params.amountDenom, params.priceDenom, 'now-24h')
}
