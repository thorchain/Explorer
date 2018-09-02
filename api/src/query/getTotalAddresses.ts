import { ElasticSearchService } from '../services/ElasticSearch'

export async function getTotalAddresses (esService: ElasticSearchService): Promise<number> {
  const result = await esService.client.search({ body: { size: 0 }, index: 'addresses', type: 'type' })

  return result.hits.total
}
