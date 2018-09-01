import { formatVersion } from './formatVersion'

it('works', () => {
  expect(formatVersion('0.1.0')).toEqual('V0.1')
  expect(formatVersion('2.3.2')).toEqual('V2.3')
})
