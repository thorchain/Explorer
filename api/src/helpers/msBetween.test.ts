import { msBetween } from './msBetween'

it('works for valid dates', () => {
  expect(msBetween([
    '2018-08-15T16:28:04.557519382Z',
    '2018-08-15T16:27:57.543225267Z',
    '2018-08-15T16:27:51.930462614Z',
    '2018-08-15T16:27:46.613210216Z',
  ])).toEqual([
    7014,
    5613,
    5317,
  ])
})
