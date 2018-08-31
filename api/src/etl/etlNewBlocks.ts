import { IRpcBlock } from '../interfaces/tendermintRpc'
import { ElasticSearchService } from '../services/ElasticSearch'
import { EtlService } from '../services/EtlService'
import { TendermintRpcClientService } from '../services/TendermintRpcClientService'
import { load as loadBlock, transform as transformBlock } from './etlBlock'

/**
 * Subscribes tendermint websocket service for new blocks, extracts, transforms and loads them. Returns a callback
 * to unsubscribe the subscribed resources
 */
export function etlNewBlocks (
  etlService: EtlService, esService: ElasticSearchService, tendermintService: TendermintRpcClientService,
) {
  try {
    tendermintService.client.subscribe({ query: 'tm.event = \'NewBlock\'' }, (event: { block: IRpcBlock }) => {
      const transformed = transformBlock(event.block)
      loadBlock(esService, transformed)
    })
  } catch (error) {
    console.error('Unexpected new block etl subscription error, will restart etl service', error)
    // restart etl service
    etlService.stop()
    etlService.start()
  }
  return () => tendermintService.client.unsubscribe({ query: 'tm.event = \'NewBlock\'' })
}
