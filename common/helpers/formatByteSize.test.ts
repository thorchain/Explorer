import { formatByteSize } from './formatByteSize'

it('works', () => {
  expect(formatByteSize(13)).toEqual('13B')
  expect(formatByteSize(998)).toEqual('998B')
  expect(formatByteSize(1000)).toEqual('0.98KB')
  expect(formatByteSize(535552)).toEqual('523.00KB')
  expect(formatByteSize(25000000)).toEqual('23.84MB')
  expect(formatByteSize(1395864371)).toEqual('1.30GB')
})
