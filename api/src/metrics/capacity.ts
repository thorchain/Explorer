import { IStoredBlock } from '../interfaces/stored'
import { transactionsPerSecond } from './transactionsPerSecond'

export function capacity (blocks: IStoredBlock[]) {
  return transactionsPerSecond(blocks) / 10000
}
