import * as express from 'express'
import { EtlService } from './services/EtlService'

const app = express()
const etlService = new EtlService()
etlService.start()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log('THORChain.info API listening on port 3000!')
})
