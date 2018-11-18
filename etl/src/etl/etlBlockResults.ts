import { IRpcBlockResults } from 'thorchain-info-common/src/interfaces/tendermintRpc'
import { env } from '../helpers/env'
import { http } from '../helpers/http'
import { logger } from '../services/logger'
import { ITransformedBlock } from './etlBlock'

export async function extractBlockResults (height: number): Promise<IRpcBlockResults> {
  const { result }: { result: IRpcBlockResults } =
    await http.get(env.TENDERMINT_RPC_REST + `/block_results?height=${height}`)

  return result
}

export function transformBlockResults<T> (result: ITransformedBlock, blockResults: IRpcBlockResults, index: number):
  T | null {
  const log = blockResults.results.DeliverTx[index].log
  if (!log) { return null }
  try {
    const logJSON = JSON.parse(log.split('json')[1]) as T
    return logJSON
  } catch (e) {
    logger.error(`Could not parse block result msg for tx ${index} in block ${result.block.height}: ${log}, `
      + `got error: ${e}`)
    throw e
  }
}
