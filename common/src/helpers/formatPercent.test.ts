import { formatPercent } from './formatPercent'

it('works', () => {
  expect(formatPercent(0.03)).toEqual('3%')
  expect(formatPercent(0.9423)).toEqual('94%')
  expect(formatPercent(0.94235, 2)).toEqual('94.24%')
  expect(formatPercent(131.94235, 2)).toEqual('13,194.24%')
})
