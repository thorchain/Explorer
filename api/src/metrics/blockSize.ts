import { IStoredBlock } from '../common/interfaces/stored'
import { avg } from '../helpers/avg'

export function blockSize (blocks: IStoredBlock[]) {
  return avg(blocks.map(block => block.size))
}
