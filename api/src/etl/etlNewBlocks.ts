import { IRpcBlock } from '../interfaces/tendermintRpc'
import { ElasticSearchService } from '../services/ElasticSearch'
import { EtlService } from '../services/EtlService'
import { logger } from '../services/logger'
import { TendermintRpcClientService } from '../services/TendermintRpcClientService'
import { load as loadBlock, transform as transformBlock } from './etlBlock'

/**
 * Subscribes tendermint websocket service for new blocks, extracts, transforms and loads them. Returns a callback
 * to unsubscribe the subscribed resources
 */
export function etlNewBlocks (
  etlService: EtlService, esService: ElasticSearchService, tendermintService: TendermintRpcClientService,
) {
  logger.debug('etlNewBlock called')

  function newBlockHandler (event: { block: IRpcBlock }) {
    logger.debug('etlNewBlock: block received, height ' + event.block.header.height)

    const transformed = transformBlock(event.block)
    loadBlock(esService, transformed)
  }
  try {
    tendermintService.client.subscribe({ query: 'tm.event = \'NewBlock\'' }, newBlockHandler)
  } catch (error) {
    logger.warn('Unexpected new block etl subscription error, will restart etl service', error)
    // restart etl service
    etlService.stop()
    etlService.start()
  }
  return () => {
    logger.debug('etlNewBlock: unsubscribe called')
    tendermintService.client.unsubscribe({ query: 'tm.event = \'NewBlock\'' })
  }
}
