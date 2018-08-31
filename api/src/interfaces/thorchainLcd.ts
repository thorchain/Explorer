export interface ILcdStakeValidatorDescription {
  moniker: string
  identity: string
  website: string
  details: string
}

export interface ILcdStakeValidator {
  owner: string
  pub_key: string
  revoked: boolean
  status: number
  tokens: string
  delegator_shares: string
  description: ILcdStakeValidatorDescription
  bond_height: string
  bond_intra_tx_counter: number
  proposer_reward_pool?: any
  commission: string
  commission_max: string
  commission_change_rate: string
  commission_change_today: string
  prev_bonded_shares: string
}

export interface ILcdStakeDelegation {
  delegator_addr: string,
  validator_addr: string,
  shares: string,
  height: string
}

