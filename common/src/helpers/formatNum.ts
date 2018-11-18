export function formatNum (num: number, decimalPlaces = 0, shorten: null | 'millions' = null) {
  if (shorten === 'millions') { num = num / 1e6 }

  let formatted = Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimalPlaces,
    minimumFractionDigits: decimalPlaces,
  }).format(num)

  if (shorten === 'millions') { formatted += 'M' }

  return formatted
}
