export function formatNum (num: number, decimalPlaces?: number, shorten: null | 'millions' = null) {
  if (shorten === 'millions') { num = num / 1e6 }

  let formatted = Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimalPlaces !== undefined ? decimalPlaces : 20,
    minimumFractionDigits: decimalPlaces !== undefined ? decimalPlaces : 0,
  }).format(num)

  if (shorten === 'millions') { formatted += 'M' }

  return formatted
}
