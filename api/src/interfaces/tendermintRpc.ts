export interface IRpcConsensusParams {
  block_size_params: {
    max_bytes: string,
    max_txs: string,
    max_gas: string,
  },
  tx_size_params: {
    max_bytes: string,
    max_gas: string,
  },
  block_gossip_params: {
    block_part_size_bytes: string,
  },
  evidence_params: {
    max_age: string,
  }
}

export interface IRpcGenesis {
  genesis_time: string,
  chain_id: string,
  consensus_params: IRpcConsensusParams,
  validators: Array<{ pub_key: IRpcPubKey, power: string, name: string }>
  app_hash: string,
  app_state: {
    accounts: IRpcGenesisAccount[],
    stake: {
      pool: {
        loose_tokens: string,
        bonded_tokens: string,
        inflation_last_time: string,
        inflation: string,
        date_last_commission_reset: string,
        prev_bonded_shares: string,
      },
      params: {
        inflation_rate_change: string,
        inflation_max: string,
        inflation_min: string,
        goal_bonded: string,
        unbonding_time: string,
        max_validators: number,
        bond_denom: string,
      },
      validators: Array<{
        owner: string,
        pub_key: {
          type: string,
          value: string,
        },
        revoked: boolean,
        status: number,
        tokens: string,
        delegator_shares: string,
        description: {
          moniker: string,
          identity: string,
          website: string,
          details: string,
        },
        bond_height: string,
        bond_intra_tx_counter: number,
        proposer_reward_pool: any[],
        commission: string,
        commission_max: string,
        commission_change_rate: string,
        commission_change_today: string,
        prev_bonded_tokens: string,
      }>,
      bonds: Array<{
        delegator_addr: string,
        validator_addr: string,
        shares: string,
        height: string,
      }>,
    },
  },
}

export interface IRpcGenesisAccount {
  address: string,
  coins: IRpcCoin[],
}

export interface IRpcStatus {
  node_info: {
    id: string,
    listen_addr: string,
    network: string,
    version: string,
    channels: string,
    moniker: string,
    other: string[],
  },
  sync_info: {
    latest_block_hash: string,
    latest_app_hash: string,
    latest_block_height: string,
    latest_block_time: string,
    catching_up: boolean,
  },
  validator_info: {
    address: string,
    pub_key: {
      type: string,
      value: string,
    },
    voting_power: string,
  }
}

export interface IRpcCoin {
  denom: string,
  amount: string,
}

export interface IRpcBlockHeader {
  app_hash: string,
  chain_id: string,
  consensus_hash: string,
  data_hash: string,
  evidence_hash: string,
  height: string,
  last_block_id: IRpcBlockId,
  last_commit_hash: string,
  last_results_hash: string,
  num_txs: string,
  time: string,
  total_txs: string,
  validators_hash: string
}

export interface IRpcBlockId {
  hash: string,
}

export interface IRpcBlock {
  data: {
    txs: null | string[],
  },
  evidence: {
    evidence: null,
  },
  header: IRpcBlockHeader
  last_commit: IRpcBlockId
}

export interface IRpcBlockMeta {
  block_id: IRpcBlockId
  header: IRpcBlockHeader
}

export interface IRpcValidator {
  accum: string,
  address: string,
  pub_key: IRpcPubKey,
  voting_power: string,
}

export interface IRpcPubKey {
  type: 'tendermint/PubKeyEd25519',
  value: string,
}

export interface IRpcSignature {
  pub_key: {
    type: string,
    value: string,
  },
  signature: {
    type: string,
    value: string,
  },
  account_number: string,
  sequence: string,
}
