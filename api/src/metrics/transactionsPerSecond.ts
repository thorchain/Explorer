import { IStoredBlock } from 'thorchain-info-common/src/interfaces/stored'
import { msBetween } from '../helpers/msBetween'
import { sum } from '../helpers/sum'

export function transactionsPerSecond (blocks: IStoredBlock[]) {
  const txsLast100 = sum(blocks.map(block => block.numTxs))
  const sLast100 = sum(msBetween(blocks.map(block => block.time))) / 1000
  return txsLast100 / sLast100
}
