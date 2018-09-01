import * as express from 'express'
import { getAllMetrics } from './metrics/getAllMetrics'
import { ElasticSearchService } from './services/ElasticSearch'
import { EtlService } from './services/EtlService'
import { TendermintRpcClientService } from './services/TendermintRpcClientService'

const app = express()
const esService = new ElasticSearchService()
const tendermintService = new TendermintRpcClientService()
const etlService = new EtlService(esService, tendermintService)
etlService.start()

// enable cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/metrics', async (req, res) => {
  res.send(await getAllMetrics(esService))
})

app.listen(3001, () => {
  console.log('THORChain.info API listening on port 3001!')
})
