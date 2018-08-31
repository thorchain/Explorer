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
  numTxs: number,
  time: string,
}
