import * as moment from 'moment'

/**
 * msBetween takes an array of n strings with datetimes and returns an array of n - 1 differences in seconds between
 * these datetimes
 */
export function msBetween (times: string[]): number[] {
  return times.reduce((
    { between, lastTime }: { between: number[], lastTime: string | null }, time: string,
  ) => {
    if (!lastTime) { return { between, lastTime: time }}
    return { between: [...between, moment(lastTime).diff(time, 'milliseconds')], lastTime: time }
  }, { between: [], lastTime: null }).between
}
