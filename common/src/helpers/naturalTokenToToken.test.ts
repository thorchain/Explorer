import { naturalTokenToToken } from './naturalTokenToToken'

it('works', () => {
  expect(naturalTokenToToken(0, 10)).toEqual(0)
  expect(naturalTokenToToken(12412, 10)).toEqual(0.0000012412)
  expect(naturalTokenToToken(12412, 3)).toEqual(12.412)
})
