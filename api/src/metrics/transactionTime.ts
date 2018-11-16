import { IStoredBlock } from 'thorchain-info-common/src/interfaces/stored'
import { blockFinality } from './blockFinality'

export function transactionTime (blocks: IStoredBlock[]) {
  return blockFinality(blocks) / 2
}
