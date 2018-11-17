import { ElasticSearchService } from './services/ElasticSearch'
import { EtlService } from './services/EtlService'

async function main () {
  const esService = new ElasticSearchService()

  await esService.ensureMappings([
    { index: 'trades', type: 'type', mapping: require('../mappings/trades.json') },
  ])

  const etlService = new EtlService(esService)
  etlService.start()
}

main ()
