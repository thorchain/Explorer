export const cache: {
  blocksToCheck: number[],
  blocksToEtl: number[],
  earliestBlockHeightCheckedInDatabase: number | null,
  latestBlockHeight: number | null,
} = {
  blocksToCheck: [],
  blocksToEtl: [],
  earliestBlockHeightCheckedInDatabase: null,
  latestBlockHeight: null,
}
