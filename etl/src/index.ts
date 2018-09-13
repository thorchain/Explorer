import { ElasticSearchService } from './services/ElasticSearch'
import { EtlService } from './services/EtlService'

const esService = new ElasticSearchService()
const etlService = new EtlService(esService)
etlService.start()
