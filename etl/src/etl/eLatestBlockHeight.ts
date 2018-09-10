import { env } from '../helpers/env'
import { http } from '../helpers/http'

export async function eLatestBlockHeight () {
  const { result }: { result: { SignedHeader: { header: { height: string } } } } =
    await http.get(env.TENDERMINT_RPC_REST + '/commit')

  return parseInt(result.SignedHeader.header.height, 10)
}
