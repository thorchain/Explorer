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

export type IOrderKind = 1 | 2

export interface IStoredLimitOrder {
  height: number,
  index: number,
  order_id: string,
  sender: string
  kind: IOrderKind
  amount: IStoredCoin,
  price: IStoredCoin,
  expires_at: string,
  time: string,
}

export interface IStoredRecentTx {
  height: number,
  index: number,
  type: 'Tx' | 'CLP'
  from: string
  to: string
  from_coins: IStoredCoin,
  to_coins?: IStoredCoin,
  time: string,
}

export interface IStoredCoin {
  denom: string,
  amount: string,
}

export interface IStoredTrade {
  height: number,
  index: number,
  maker_order_id: string,
  taker_order_id: string,
  amount: IStoredCoin,
  price: IStoredCoin,
  time: string,
}
