import { env } from '../helpers/env'
import { http } from '../helpers/http'
import { IRpcBlockResults } from '../interfaces/tendermintRpc'

export async function extract (height: number): Promise<IRpcBlockResults> {
  const { result }: { result: IRpcBlockResults } =
    await http.get(env.TENDERMINT_RPC_REST + `/block_results?height=${height}`)

  return result
}
