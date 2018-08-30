import { RpcClient } from 'tendermint'
import { env } from '../helpers/env'

export class TendermintRpcClientService {
  public client: any

  constructor () {
    this.client = RpcClient(env.TENDERMINT_RPC_WS)
  }
}
