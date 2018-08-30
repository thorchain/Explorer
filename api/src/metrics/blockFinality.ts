import { avg } from '../helpers/avg'
import { msBetween } from '../helpers/msBetween'
import { IStoredBlock } from '../interfaces/stored'

export function blockFinality (blocks: IStoredBlock[]) {
  return avg(msBetween(blocks.map(block => block.time)))
}
