import { IMetrics } from '../interfaces/metrics'
import { getLastStoredBlocks } from '../query/getLastStoredBlocks'
import { getStoredGenesis } from '../query/getStoredGenesis'
import { getStoredStatus } from '../query/getStoredStatus'
import { getStoredValidators } from '../query/getStoredValidators'
import { ElasticSearchService } from '../services/ElasticSearch'
import { blockFinality } from './blockFinality'
import { capacity } from './capacity'
import { transactionsPerSecond } from './transactionsPerSecond'
import { transactionTime } from './transactionTime'

export async function getAllMetrics(esService: ElasticSearchService): Promise<IMetrics> {
  const { genesisTime, inflation } = await getStoredGenesis(esService)
  const { blockHeight, chainId } = await getStoredStatus(esService)
  const { validatorCount, totalStaked } = await getStoredValidators(esService)
  const last100Blocks = await getLastStoredBlocks(esService, 100)

  return {
    blockFinalityLast100: blockFinality(last100Blocks),
    blockHeight,
    capacity: capacity(last100Blocks),
    chainId,
    genesisTime,
    inflation,
    totalStaked,
    transactionTimeLast100: transactionTime(last100Blocks),
    transactionsPerSecondLast100: transactionsPerSecond(last100Blocks),
    validatorCount,
  }
}
