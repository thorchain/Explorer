import * as express from 'express'
import { getAllMetrics } from './metrics/getAllMetrics'
import { getRecentTxsMetrics } from './metrics/getRecentTxsMetrics'
import { ElasticSearchService } from './services/ElasticSearch'
import { logger } from './services/logger'

const app = express()
const esService = new ElasticSearchService()

// enable cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/api/status', async (req, res) => {
  res.sendStatus(200)
})

app.get('/api/metrics', async (req, res) => {
  try {
    res.send(await getAllMetrics(esService))
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
})

app.get('/api/recent-txs', async (req, res) => {
  const size = parseInt(req.query.size, 10) || 5
  try {
    res.send(await getRecentTxsMetrics(esService, size))
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
})

app.listen(3001, () => {
  logger.info('THORChain.info API listening on port 3001!')
})
