export function calcBase64ByteSize (base64: string) {
  const resultWithPadding = 3 * Math.ceil(base64.length/4)

  let padding = 0
  if (base64.length >= 1 && base64[base64.length - 1] === '=') { padding++ }
  if (base64.length >= 2 && base64[base64.length - 2] === '=') { padding++ }

  return resultWithPadding - padding
}
