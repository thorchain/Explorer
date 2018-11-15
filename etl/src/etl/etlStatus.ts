import { IStoredStatus } from '../common/interfaces/stored'
import { env } from '../helpers/env'
import { http } from '../helpers/http'
import { IRpcStatus } from '../interfaces/tendermintRpc'
import { ElasticSearchService } from '../services/ElasticSearch'
import { EtlService } from '../services/EtlService'
import { logger } from '../services/logger'

export async function etlStatus (etlService: EtlService, esService: ElasticSearchService) {
  logger.debug('etlStatus called')

  try {
    const extracted = await extract()
    const transformed = transform(extracted)
    await load(esService, transformed)
  } catch (e) {
    logger.error('Unexpected status etl error', e)
  }
  logger.debug('etlStatus done')
}

async function extract (): Promise<IRpcStatus> {
  const { result }: { result: IRpcStatus } = await http.get(env.TENDERMINT_RPC_REST + '/status')

  return result
}

function transform (status: IRpcStatus): IStoredStatus {
  return {
    chainId: status.node_info.network,
  }
}

async function load(esService: ElasticSearchService, status: IStoredStatus) {
  await esService.client.index({ body: status, id: 'status', index: 'blockchain', type: 'type' })
}
