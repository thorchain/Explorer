import { avg } from './avg'

it('works', () => {
  expect(avg([ 3, 4, 5 ])).toBe(4)
  expect(avg([ 3, 4, 5, 6 ])).toBe(4.5)
})
