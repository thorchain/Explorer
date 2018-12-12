import { IExchangeTrade, IExchangeTradesParams } from 'thorchain-info-common/src/interfaces/metrics'
import { getStoredTrades } from '../query/getStoredTrades'
import { ElasticSearchService } from '../services/ElasticSearch'

export async function getExchangeTrades(
  esService: ElasticSearchService, params: IExchangeTradesParams, account?: string,
): Promise<IExchangeTrade[]> {
    const storedTrades = await getStoredTrades(esService, params.amountDenom, params.priceDenom, 20, account)

    return storedTrades.map(trade => ({
      amount: parseInt(trade.amount.amount, 10),
      price: parseInt(trade.price.amount, 10),
    }))
}
