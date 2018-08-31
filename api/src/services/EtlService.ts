import { etlGenesis } from '../etl/etlGenesis'
import { etlNewBlocks } from '../etl/etlNewBlocks'
import { etlPastBlocks } from '../etl/etlPastBlocks'
import { etlStatus } from '../etl/etlStatus'
import { etlValidators } from '../etl/etlValidators'
import { ElasticSearchService } from './ElasticSearch'
import { TendermintRpcClientService } from './TendermintRpcClientService'

export class EtlService {
  private timeout: NodeJS.Timer|null = null
  private unsubscribers = new Set<() => void>()
  private running = new Set<Promise<void>>()
  private startAgain = false
  private status: 'stopped' | 'starting' | 'running' | 'stopping' = 'stopped'

  constructor (private esService: ElasticSearchService, private tendermintservice: TendermintRpcClientService) { }

  public async start () {
    if (this.status === 'starting' || this.status === 'running' || this.status === 'stopping') {
      console.info(`EtlService is ${this.status}, will restart after it has been stopped.`)
      this.startAgain = true
      return
    }
    this.status = 'starting'
    console.info('EtlService starting.')

    this.unsubscribers.add(etlNewBlocks(this, this.esService, this.tendermintservice))
    this.scheduleUpdatePastData()

    this.status = 'running'
    console.info('EtlService started.')
  }

  public async stop () {
    if (this.status === 'stopping' || this.status === 'stopped') { return }

    this.status = 'stopping'
    console.info('EtlService stopping.')

    // unsubsribe all
    this.unsubscribers.forEach(unsubscriber => unsubscriber())
    this.unsubscribers.clear()

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
    console.info('EtlService stopped.')

    // restart if a restart is scheduled
    if (this.startAgain) {
      console.info('EtlService will restart.')
      this.startAgain = false
      this.start()
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
    await etlGenesis(this, this.esService)
    await etlStatus(this, this.esService)
    await etlValidators(this, this.esService)
    await etlPastBlocks(this, this.esService)
  }
}
