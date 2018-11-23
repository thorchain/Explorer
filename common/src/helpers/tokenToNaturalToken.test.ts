import { tokenToNaturalToken } from './tokenToNaturalToken'

it('works', () => {
  expect(tokenToNaturalToken(0, 10)).toEqual(0)
  expect(tokenToNaturalToken(12412, 10)).toEqual(124120000000000)
  expect(tokenToNaturalToken(0.12412, 10)).toEqual(1241200000)
  expect(tokenToNaturalToken(0.0012412, 3)).toEqual(1)
})
