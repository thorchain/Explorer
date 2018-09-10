import { IRpcCoin, IRpcSignature } from './tendermintRpc'

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

export interface ILcdCosmosSdkSendMsg {
  type: 'cosmos-sdk/Send',
  value: {
    inputs: ILcdCosmosSdkSendMsgInputOutput[],
    outputs: ILcdCosmosSdkSendMsgInputOutput[],
  },
}

export interface ILcdCosmosSdkSendMsgInputOutput {
  address: string,
  coins: IRpcCoin[],
}

export interface ILcdClpTradeMsg {
  type: 'clp/MsgTrade',
  value: {
    Sender: string,
    FromTicker: string,
    ToTicker: string,
    FromAmount: string,
  }
}

export interface ILcdDecodedTx {
  type: 'auth/StdTx',
  value: {
    msg: Array<ILcdCosmosSdkSendMsg | ILcdClpTradeMsg>,
    fee: {
      amount: IRpcCoin[],
      gas: string,
    },
    signatures: IRpcSignature[],
    memo: string,
  }
}
