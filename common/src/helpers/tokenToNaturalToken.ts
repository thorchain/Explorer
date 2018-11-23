export function tokenToNaturalToken (num: number, decimals: number) {
  return Math.round(num * Math.pow(10, decimals))
}
