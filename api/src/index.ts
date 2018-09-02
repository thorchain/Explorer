import * as express from 'express'
import { getAllMetrics } from './metrics/getAllMetrics'
import { getRecentTxsMetrics } from './metrics/getRecentTxsMetrics'
import { ElasticSearchService } from './services/ElasticSearch'
import { EtlService } from './services/EtlService'
import { logger } from './services/logger'

const app = express()
const esService = new ElasticSearchService()
const etlService = new EtlService(esService)
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

app.get('/recent-txs', async (req, res) => {
  const size = parseInt(req.query.size, 10) || 5
  res.send(await getRecentTxsMetrics(esService, size))
})

app.listen(3001, () => {
  logger.info('THORChain.info API listening on port 3001!')
})
