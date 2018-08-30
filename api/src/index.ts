import * as express from 'express'
import { ElasticSearchService } from './services/ElasticSearch'
import { EtlService } from './services/EtlService'
import { TendermintRpcClientService } from './services/TendermintRpcClientService'

const app = express()
const esService = new ElasticSearchService()
const tendermintService = new TendermintRpcClientService()
const etlService = new EtlService(esService, tendermintService)
etlService.start()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log('THORChain.info API listening on port 3000!')
})
