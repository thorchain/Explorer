import { formatNum } from './formatNum'

export function formatByteSize (num: number) {
  // GB
  if (num > 999*1024*1024) { return formatNum(num/1024/1024/1024, 2) + 'GB' }

  // MB
  if (num > 999*1024) { return formatNum(num/1024/1024, 2) + 'MB' }

  // KB
  if (num > 999) { return formatNum(num/1024, 2) + 'KB' }

  // Bytes
  return formatNum(num, 0) + 'B'
}
