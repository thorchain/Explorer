import { env } from '../helpers/env'
import { http } from '../helpers/http'
import { IStoredValidators } from '../interfaces/stored'
import { IRpcValidator } from '../interfaces/tendermint'
import { ElasticSearchService } from '../services/ElasticSearch'
import { EtlService } from '../services/EtlService'

export async function etlValidators (etlService: EtlService, esService: ElasticSearchService) {
  try {
    const extracted = await extract()
    const transformed = transform(extracted)
    await load(esService, transformed)
  } catch (e) {
    // restart etl service
    etlService.stop()
    etlService.start()
  }
}

async function extract (): Promise<IRpcValidator[]> {
  const { result }: { result: { validators: IRpcValidator[] } } =
    await http.get(env.TENDERMINT_RPC_REST + '/validators')

  return result.validators
}

function transform (validators: IRpcValidator[]): IStoredValidators {
  return {
    totalStaked: validators.reduce((total: number, v: IRpcValidator) => total + parseFloat(v.voting_power), 0),
    validatorCount: validators.length,
  }
}

async function load(esService: ElasticSearchService, validators: IStoredValidators) {
  await esService.client.index({
    body: validators,
    id: 'validators',
    index: 'blockchain',
    type: 'type',
  })
}
