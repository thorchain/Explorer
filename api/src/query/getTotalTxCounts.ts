import { ElasticSearchService } from '../services/ElasticSearch'

export async function getTotalTxCounts (esService: ElasticSearchService): Promise<{
  totalClpTxs: number,
  totalExchanged: number,
  totalTransacted: number,
  totalTxs: number,
}> {
  const result: { 'aggregations': any } =
    await esService.client.search({ body: {
      'aggs' : {
        'totalClpTxs' : { 'sum' : { 'field' : 'numClpTxs' } },
        'totalExchanged' : { 'sum' : { 'field' : 'amountTransactedClp' } },
        'totalTransacted' : { 'sum' : { 'field' : 'amountTransacted' } },
        'totalTxs' : { 'sum' : { 'field' : 'numTxs' } },
      },
      'size': 0,
    }, index: 'blocks', type: 'type' }) as any

  return {
    totalClpTxs: result.aggregations.totalClpTxs.value,
    totalExchanged: result.aggregations.totalExchanged.value,
    totalTransacted: result.aggregations.totalTransacted.value,
    totalTxs: result.aggregations.totalTxs.value,
  }
}
