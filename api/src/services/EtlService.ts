import { etlGenesis } from '../etl/etlGenesis'
import { etlNewBlocks } from '../etl/etlNewBlocks'
import { etlPastBlocks } from '../etl/etlPastBlocks'
import { etlStatus } from '../etl/etlStatus'
import { etlValidators } from '../etl/etlValidators'
import { ElasticSearchService } from './ElasticSearch'
import { TendermintRpcClientService } from './TendermintRpcClientService'

export class EtlService {
  private intervals: NodeJS.Timer[] = []

  constructor (private esService: ElasticSearchService, private tendermintservice: TendermintRpcClientService) { }

  public async start () {
    etlNewBlocks(this, this.esService, this.tendermintservice)
    await etlGenesis(this, this.esService)
    await etlStatus(this, this.esService)
    await etlValidators(this, this.esService)
    await etlPastBlocks(this, this.esService)
    // this.intervals.push(setInterval(() => etlGenesis(this, this.esService), 60e3))
    // this.intervals.push(setInterval(() => etlStatus(this, this.esService), 60e3))
    // this.intervals.push(setInterval(() => etlValidators(this, this.esService), 60e3))
    // this.intervals.push(setInterval(() => etlPastBlocks(this, this.esService), 60e3))
  }

  public async stop () {
    this.intervals.forEach(interval => clearInterval(interval))
  }
}
