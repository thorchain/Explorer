/**
 * Computes the sum
 */
export function sum (nums: number[]): number {
  return nums.reduce((result: number, num: number) => result + num, 0)
}
