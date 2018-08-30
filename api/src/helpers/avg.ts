import { sum } from './sum'

/**
 * Computes the average
 */
export function avg (nums: number[]): number {
  return sum(nums) / nums.length
}
