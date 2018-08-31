import { IMetrics } from '../interfaces/metrics'
import { getLastStoredBlocks } from '../query/getLastStoredBlocks'
import { getStoredGenesis } from '../query/getStoredGenesis'
import { getStoredStatus } from '../query/getStoredStatus'
import { getStoredValidators } from '../query/getStoredValidators'
import { getTotalTxCount } from '../query/getTotalTxCount'
import { ElasticSearchService } from '../services/ElasticSearch'
import { blockFinality } from './blockFinality'
import { capacity } from './capacity'
import { transactionsPerSecond } from './transactionsPerSecond'
import { transactionTime } from './transactionTime'
import { version } from './version'

export async function getAllMetrics(esService: ElasticSearchService): Promise<IMetrics> {
  const { genesisTime } = await getStoredGenesis(esService)
  const { blockHeight, chainId } = await getStoredStatus(esService)
  const { validatorCount, totalStaked, totalStakedByValidators } = await getStoredValidators(esService)
  const last100Blocks = await getLastStoredBlocks(esService, 100)
  const totalTxCount = await getTotalTxCount(esService)

  return {
    network: {
      blockFinalityLast100Blocks: blockFinality(last100Blocks),
      blockHeight,
      blockSizeLast100Blocks: null, // TODO
      capacityLast100Blocks: capacity(last100Blocks),
      genesisTime,
      transactionsPerSecondLast100Blocks: transactionsPerSecond(last100Blocks),
    },
    software: {
      daemonVersion: null, // TODO
      explorerVersion: version(),
      testnet: chainId,
    },
    transactions: {
      aveClpFeeLast100Blocks: null, // TODO
      aveTxFeeLast100Blocks: null, // TODO
      clpTimeLast100Blocks: null, // TODO
      totalAdresses: null, // TODO
      totalClpTxCount: null, // TODO
      totalExchanged: null, // TODO
      totalTransacted: null, // TODO
      totalTxCount,
      txTimeLast100Blocks: transactionTime(last100Blocks),
    },
    validators: {
      backupValidatorCount: null, // TODO
      blockReward: null, // TODO
      delegatedStake: totalStaked - totalStakedByValidators,
      delegatorCount: null, // TODO
      inflation: null, // TODO
      networkSecurityInMUsd: null, // TODO
      queuedStake: null, // TODO
      stakeLevel: totalStakedByValidators / totalStaked,
      totalBlockRewards: null, // TODO
      totalStaked,
      totalStakedByValidators,
      validatorCount,
    },
  }
}
