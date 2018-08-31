import { env } from '../helpers/env'
import { http } from '../helpers/http'
import { IStoredBlock } from '../interfaces/stored'
import { IRpcBlock } from '../interfaces/tendermintRpc'
import { ElasticSearchService } from '../services/ElasticSearch'
import { EtlService } from '../services/EtlService'

/**
 * Checks for missing past blocks in database. If blocks are missing, extracts, transforms and loads them.
 * @param esService
 */
export async function etlBlock (etlService: EtlService, esService: ElasticSearchService, height: number) {
  const extracted = await extract(height)
  const transformed = transform(extracted)
  await load(esService, transformed)
}

async function extract (height: number): Promise<IRpcBlock> {
  const { result }: { result: { block: IRpcBlock } } =
    await http.get(env.TENDERMINT_RPC_REST + `/block?height=${height}`)

  return result.block
}

export function transform (block: IRpcBlock): IStoredBlock {
  return {
    height: parseInt(block.header.height, 10),
    numTxs: parseInt(block.header.num_txs, 10),
    time: block.header.time,
  }
}

export async function load(esService: ElasticSearchService, block: IStoredBlock) {
  await esService.client.index({ body: block, id: `${block.height}`, index: 'blocks', type: 'type' })
}
