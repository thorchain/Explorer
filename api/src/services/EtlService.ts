import { etlGenesis } from '../etl/etlGenesis'
import { etlNewBlocks } from '../etl/etlNewBlocks'
import { etlPastBlocks } from '../etl/etlPastBlocks'
import { etlStatus } from '../etl/etlStatus'
import { etlValidators } from '../etl/etlValidators'
import { ElasticSearchService } from './ElasticSearch'
import { logger } from './logger'
import { TendermintRpcClientService } from './TendermintRpcClientService'

export class EtlService {
  private status: 'stopped' | 'starting' | 'running' | 'stopping' = 'stopped'
  private timeout: NodeJS.Timer|null = null
  private disposers = new Set<() => void>()
  private running = new Set<Promise<void>>()
  private startAgain = false

  constructor (private esService: ElasticSearchService, private tendermintservice: TendermintRpcClientService) { }

  public async start () {
    if (this.status === 'starting' || this.status === 'running' || this.status === 'stopping') {
      logger.info(`EtlService is ${this.status}, will restart after it has been stopped.`)
      this.startAgain = true
      return
    }
    this.status = 'starting'
    logger.info('EtlService starting.')

    this.disposers.add(etlNewBlocks(this, this.esService, this.tendermintservice))
    this.scheduleUpdatePastData()

    this.status = 'running'
    logger.info('EtlService started.')
  }

  public async stop () {
    if (this.status === 'stopping' || this.status === 'stopped') { return }

    this.status = 'stopping'
    logger.info('EtlService stopping.')

    // dispose all
    this.disposers.forEach(dispose => dispose())
    this.disposers.clear()

    // clear timeout
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    // wait for startEtl promises to resolve/reject before ending
    for (const promise of this.running) {
      try {
        await promise
      } catch (e) {
        // do not handle, we are stopping already
      }
    }
    this.running.clear()

    this.status = 'stopped'
    logger.info('EtlService stopped.')

    // restart if a restart is scheduled
    if (this.startAgain) {
      logger.info('EtlService will restart in 10 seconds.')
      setTimeout(() => {
        this.startAgain = false
        this.start()
      }, 10e3)
    }
  }

  private async scheduleUpdatePastData () {
    const promise = this.updatePastData()
    this.running.add(promise)
    await promise
    this.running.delete(promise)

    // schedule update of all data after timeout
    this.timeout = setTimeout(() => {
      this.scheduleUpdatePastData()
    }, 60e3)
  }

  private async updatePastData () {
    if (this.status !== 'running' && this.status !== 'starting') { return }
    await etlGenesis(this, this.esService)
    if (this.status !== 'running' && this.status !== 'starting') { return }
    await etlStatus(this, this.esService)
    if (this.status !== 'running' && this.status !== 'starting') { return }
    await etlValidators(this, this.esService)
    if (this.status !== 'running' && this.status !== 'starting') { return }
    const etlPastBlocksManager = etlPastBlocks(this, this.esService)
    this.disposers.add(etlPastBlocksManager.disposer)
    await etlPastBlocksManager.promise
  }
}
