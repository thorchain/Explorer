import { IStoredBlock } from 'thorchain-info-common/src/interfaces/stored'
import { ElasticSearchService } from '../services/ElasticSearch'

export async function getLastStoredBlocks (esService: ElasticSearchService, num: number): Promise<IStoredBlock[]> {
  const { hits: { hits } } =
    await esService.client.search<IStoredBlock>({ body: {
      from: 0,
      size: 100,
      sort: [
        { height: 'desc' },
      ],
    }, index: 'blocks', type: 'type' })

  return hits.map(hit => hit._source)
}
