import * as elasticsearch from 'elasticsearch'
import { env } from '../helpers/env'
import { logger } from './logger'

export class ElasticSearchService {
  public client: elasticsearch.Client

  constructor () {
    this.client = new elasticsearch.Client({
      host: env.ELASTICSEARCH_HOST,
      // log: 'trace',
    })
  }

  public async ensureMappings (definitions: Array<{ index: string, type: string, mapping: object }>) {
    await Promise.all(definitions.map(async (def) => {
      if (await this.existsType(def.index, def.type)) {
        logger.info(`Mapping for index "${def.index}" and type "${def.type}" exists, will not update mapping`)
        return
      }
      await this.createIndex(def.index, def.mapping)
      logger.info(`Updated mapping for index "${def.index}" and type "${def.type}"`)
    }))
  }

  public existsType (index: string, type: string) {
    return new Promise((resolve, reject) =>
      this.client.indices.existsType({ index, type }, (err, res) => {
        if (err) { reject(err) } else { resolve(res) }
      }),
    )
  }

  public createIndex (index: string, mapping: any) {
    return new Promise((resolve, reject) =>
      this.client.indices.create({ index, body: mapping }, (err, res) => {
        if (err) { reject(err) } else { resolve(res) }
      }),
    )
  }

  public putMapping (index: string, type: string, mapping: any) {
    return new Promise((resolve, reject) =>
      this.client.indices.putMapping({ index, type, body: mapping }, (err, res) => {
        if (err) { reject(err) } else { resolve(res) }
      }),
    )
  }

  public bulk (body: any) {
    return new Promise((resolve, reject) =>
      this.client.bulk(body, (err, res) => {
        if (err) { reject(err) } else { resolve(res) }
      }),
    )
  }
}
