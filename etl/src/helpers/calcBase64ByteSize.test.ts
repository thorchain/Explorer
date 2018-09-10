import { calcBase64ByteSize } from './calcBase64ByteSize'

it('works', () => {
  let str = ''
  expect(calcBase64ByteSize(Buffer.from(str).toString('base64'))).toBe(str.length)

  str = 'a'
  expect(calcBase64ByteSize(Buffer.from(str).toString('base64'))).toBe(str.length)

  str = 'Hello World'
  expect(calcBase64ByteSize(Buffer.from(str).toString('base64'))).toBe(str.length)

  str = 'Hello Worlds'
  expect(calcBase64ByteSize(Buffer.from(str).toString('base64'))).toBe(str.length)
})


