import * as elasticsearch from 'elasticsearch'
import { env } from '../helpers/env'

export class ElasticSearchService {
  public client: elasticsearch.Client

  constructor () {
    this.client = new elasticsearch.Client({
      host: env.ELASTICSEARCH_HOST,
      // log: 'trace',
    })
  }

  public bulk (body: any) {
    return new Promise((resolve, reject) =>
      this.client.bulk(body, (err, res) => {
        if (err) { reject(err) } else { resolve(res) }
      }),
    )
  }
}
