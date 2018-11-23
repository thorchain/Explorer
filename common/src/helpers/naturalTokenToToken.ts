export function naturalTokenToToken (num: number, decimals: number) {
  return num / Math.pow(10, decimals)
}
