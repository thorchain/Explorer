export function formatPercent (num: number, decimalPlaces = 0, plusPrefix = false) {
  const percent = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimalPlaces,
    minimumFractionDigits: decimalPlaces,
    style: 'percent',
  })
    .format(num)

  if (plusPrefix && num > 0) {
    return `+${percent}`
  }

  return percent
}
