import { msBetween } from '../helpers/msBetween'
import { sum } from '../helpers/sum'
import { IStoredBlock } from '../common/interfaces/stored'

export function transactionsPerSecond (blocks: IStoredBlock[]) {
  const txsLast100 = sum(blocks.map(block => block.numTxs))
  const sLast100 = sum(msBetween(blocks.map(block => block.time))) / 1000
  return txsLast100 / sLast100
}
