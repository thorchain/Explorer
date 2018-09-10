import { env } from '../helpers/env'
import { http } from '../helpers/http'
import { IRpcBlockResults } from '../interfaces/tendermintRpc'
import { logger } from '../services/logger'
import { ITransformedBlock } from './etlBlock'

export async function extract (height: number): Promise<IRpcBlockResults> {
  const { result }: { result: IRpcBlockResults } =
    await http.get(env.TENDERMINT_RPC_REST + `/block_results?height=${height}`)

  // filter out erroneous block results, we are only interested in the data of the successful block results here

  return result
}

export function transformBlockResults (result: ITransformedBlock, blockResults: IRpcBlockResults, index: number):
  ITransformedBlockResultsMsg {
  const log = blockResults.results.DeliverTx[index].log
  if (!log) { return { fromTokenSpent: 0, runeTransacted: 0, toTokenReceived: 0 } }
  try {
    const logJSON = JSON.parse(log.split('json')[1]) as ITransformedBlockResultsMsg
    return logJSON
  } catch (e) {
    logger.error(`Could not parse block result msg for tx ${index} in block ${result.block.height}: ${log}, `
      + `got error: ${e}`)
    throw e
  }
}

export interface ITransformedBlockResultsMsg {
  fromTokenSpent: number,
  runeTransacted: number,
  toTokenReceived: number,
}
