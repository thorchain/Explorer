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
