import { IRpcCoin } from './tendermintRpc'
import { IOrderKind } from './thorchainLcd'

export interface IStoredGenesis {
  genesisTime: string,
  inflation: number,
}

export interface IStoredStatus {
  chainId: string,
}

export interface IStoredValidators {
  validatorCount: number,
  totalStaked: number,
  totalStakedByValidators: number,
}

export interface IStoredBlock {
  height: number,
  numClpTxs: number,
  numTxs: number,
  size: number,
  time: string,
  amountTransacted: number,
  amountTransactedClp: number,
}

export interface IStoredLimitOrder {
  height: number,
  index: number,
  order_id: string,
  sender: string
  kind: IOrderKind
  amount: IRpcCoin,
  price: IRpcCoin,
  expires_at: string,
}

export interface IStoredRecentTx {
  height: number,
  index: number,
  type: 'Tx' | 'CLP'
  from: string
  to: string
  from_coins: IRpcCoin,
  to_coins?: IRpcCoin,
  time: string,
}

export interface IStoredTrade {
  height: number,
  index: number,
  maker_order_id: string,
  taker_order_id: string,
  amount: IRpcCoin,
  price: IRpcCoin,
}
