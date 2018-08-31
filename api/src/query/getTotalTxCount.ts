import { ElasticSearchService } from '../services/ElasticSearch'

export async function getTotalTxCount (esService: ElasticSearchService): Promise<number> {
  const result: { 'aggregations': { 'totalTxs': { 'value': number } } } =
    await esService.client.search({ body: {
      'aggs' : {
        'totalTxs' : { 'sum' : { 'field' : 'numTxs' } },
      },
      'size': 0,
    }, index: 'blocks', type: 'type' }) as any

  return result.aggregations.totalTxs.value
}
