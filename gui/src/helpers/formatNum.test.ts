import { formatNum } from './formatNum'

it('works', () => {
  expect(formatNum(131.137313)).toEqual('131')
  expect(formatNum(131.737313)).toEqual('132')
  expect(formatNum(1312131)).toEqual('1,312,131')
  expect(formatNum(1312131, 3)).toEqual('1,312,131.000')
  expect(formatNum(131.737313, 2)).toEqual('131.74')
  expect(formatNum(1231.735316, 2)).toEqual('1,231.74')
  expect(formatNum(148231.735316, 5)).toEqual('148,231.73532')
  expect(formatNum(1311248231.73531, 3)).toEqual('1,311,248,231.735')
  expect(formatNum(1311548231, 0, 'millions')).toEqual('1,312M')
  expect(formatNum(1311248531.73531, 3, 'millions')).toEqual('1,311.249M')
})
