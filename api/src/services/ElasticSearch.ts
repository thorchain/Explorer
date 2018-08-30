import * as elasticsearch from 'elasticsearch'
import { env } from '../helpers/env'

export class ElasticSearchService {
  public client: elasticsearch.Client

  constructor () {
    this.client = new elasticsearch.Client({
      host: env.ELASTICSEARCH_HOST,
      log: 'trace',
    })
  }
}
