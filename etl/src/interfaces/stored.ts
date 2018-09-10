import { IRpcCoin } from './tendermintRpc'

export interface IStoredGenesis {
  genesisTime: string,
  inflation: number,
}

export interface IStoredStatus {
  blockHeight: number,
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
