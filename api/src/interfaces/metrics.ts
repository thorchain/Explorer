export interface IMetrics {
  blockHeight: null | number,
  chainId: null | string,
  genesisTime: null | string,
  inflation: null | number,
  totalStaked: null | number,
  validatorCount: null | number,
  transactionsPerSecondLast100: null | number,
  blockFinalityLast100: null | number,
  transactionTimeLast100: null | number,
  capacity: null | number,
}
