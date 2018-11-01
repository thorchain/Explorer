import { env } from '../helpers/env'
import { http } from '../helpers/http'
import { IStoredValidators } from '../interfaces/stored'
import { ILcdStakeDelegation, ILcdStakeValidator } from '../interfaces/thorchainLcd'
import { ElasticSearchService } from '../services/ElasticSearch'
import { EtlService } from '../services/EtlService'
import { logger } from '../services/logger'

export async function etlValidators (etlService: EtlService, esService: ElasticSearchService) {
  logger.debug('etlValidators called')

  try {
    const extracted = await extract()
    const transformed = transform(extracted)
    await load(esService, transformed)
  } catch (e) {
    logger.error('Unexpected validators etl error', e)
  }
  logger.debug('etlValidators done')
}

async function extract (): Promise<{ validators: ILcdStakeValidator[], validatorDelegations: ILcdStakeDelegation[] }> {
  const validators: ILcdStakeValidator[] =
    await http.get(env.THORCHAIN_LCD_REST + '/stake/validators')

  // extract self delegations to determine how much validators have at stake
  const validatorDelegations = await Promise.all(validators.map(async (validator) => {
    const delegation: ILcdStakeDelegation =
      await http.get(env.THORCHAIN_LCD_REST + `/stake/delegators/${validator.owner}/delegations/${validator.owner}`)
    return delegation
  }))

  return { validators, validatorDelegations }
}

function transform ({ validators, validatorDelegations }: {
  validators: ILcdStakeValidator[], validatorDelegations: ILcdStakeDelegation[],
}): IStoredValidators {
  return {
    totalStaked: validators.reduce((total: number, v: ILcdStakeValidator) => total + parseFloat(v.tokens), 0),
    totalStakedByValidators: validatorDelegations.reduce(
      (total: number, d: ILcdStakeDelegation) => total + parseFloat(d.shares), 0),
    validatorCount: validators.length,
  }
}

async function load(esService: ElasticSearchService, validators: IStoredValidators) {
  await esService.client.index({ body: validators, id: 'validators', index: 'blockchain', type: 'type' })
}
