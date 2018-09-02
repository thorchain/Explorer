import { avg } from '../helpers/avg'
import { IStoredBlock } from '../interfaces/stored'

export function blockSize (blocks: IStoredBlock[]) {
  return avg(blocks.map(block => block.size))
}
