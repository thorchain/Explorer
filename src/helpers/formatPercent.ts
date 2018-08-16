export function formatPercent (num: number, decimalPlaces = 0) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimalPlaces,
    minimumFractionDigits: decimalPlaces,
    style: 'percent',
  })
    .format(num)
}
