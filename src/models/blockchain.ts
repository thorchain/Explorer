 import { destroy, flow, types } from 'mobx-state-tree'
import { RpcClient } from 'tendermint'
import { tendermintRpcRest, tendermintRpcWs } from '../config'
import { avg } from '../helpers/avg'
import { http } from '../helpers/http'
import { msBetween } from '../helpers/msBetween'
import { sum } from '../helpers/sum'
import { IRpcBlock, IRpcBlockMeta, IRpcGenesis, IRpcStatus, IRpcValidator } from '../interfaces/tendermint'

const client = RpcClient(tendermintRpcWs)
const maxRecentBlocks = 100

const Block = types.model({
  height: types.number,
  numTxs: types.number,
  time: types.string,
})

export const BlockchainStore = types.model({
  blockHeight: types.maybeNull(types.number),
  chainId: types.maybeNull(types.string),
  genesisTime: types.maybeNull(types.string),
  inflation: types.maybeNull(types.number),
  recentBlocks: types.array(Block),
  totalStaked: types.maybeNull(types.number),
  validatorCount: types.maybeNull(types.number),
})
.actions(self => ({
  fetchGenesis: flow(function* fetchGenesis() {
    try {
      const { result }: { result: { genesis: IRpcGenesis } } = yield http.get(tendermintRpcRest + '/genesis')
      // console.log(JSON.stringify(result)) // tslint:disable-line:no-console
      const [ inflationN, inflationD ] = result.genesis.app_state.stake.pool.inflation.split('/')
      self.inflation = parseFloat(inflationN) / parseFloat(inflationD)
      self.genesisTime = result.genesis.genesis_time
    } catch (error) {
      console.error('Failed to fetch genesis', error) // tslint:disable-line:no-console
    }
  }),
  fetchStatus: flow(function* fetchStatus() {
    try {
      const { result }: { result: IRpcStatus } = yield http.get(tendermintRpcRest + '/status')
      // console.log(JSON.stringify(result)) // tslint:disable-line:no-console
      self.chainId = result.node_info.network
      self.blockHeight = parseInt(result.sync_info.latest_block_height, 10)
    } catch (error) {
      console.error('Failed to fetch status', error) // tslint:disable-line:no-console
    }
  }),
  fetchValidators: flow(function* fetchValidators() {
    try {
      const { result }: { result: { validators: IRpcValidator[] } } = yield http.get(tendermintRpcRest + '/validators')
      // console.log(result) // tslint:disable-line:no-console
      self.validatorCount = result.validators.length
      self.totalStaked = result.validators.reduce(
        (total: number, v: IRpcValidator) => total + parseFloat(v.voting_power), 0)
    } catch (error) {
      console.error('Failed to fetch validators', error) // tslint:disable-line:no-console
    }
  }),
  receiveNewBlock(block: IRpcBlock) {
    self.blockHeight = parseInt(block.header.height, 10)

    self.recentBlocks.unshift(sanitizeRpcBlock(block))

    // remove blocks if there are more than maxRecentBlocks
    for (let i = maxRecentBlocks; i < self.recentBlocks.length; i++) {
      destroy(self.recentBlocks[i])
    }
  },
}))
.actions(self => ({
  subNewBlock() {
    try {
      client.subscribe({ query: 'tm.event = \'NewBlock\'' }, (event: { block: IRpcBlock }) => {
        self.receiveNewBlock(event.block)

        // check for validators every 10 blocks
        if (self.blockHeight && self.blockHeight % 10 === 0) {
          self.fetchValidators()
        }
      })
    } catch (error) {
      console.error('Subscription error, new block', error) // tslint:disable-line:no-console
    }
  },
}))
.actions(self => ({
  fetchLast100Blocks: flow(function* fetchLast100Blocks() {
    const height = self.blockHeight!
    try {
      const results: Array<{ block_metas: IRpcBlockMeta[], last_height: string }> = yield Promise.all([
        fetchBlocks(height - 19, height),
        fetchBlocks(height - 39, height - 20),
        fetchBlocks(height - 59, height - 40),
        fetchBlocks(height - 79, height - 60),
        fetchBlocks(height - 99, height - 80),
      ])
      // console.log('results', results) // tslint:disable-line:no-console
      results.forEach(result => {
        const blocks = result.block_metas.map(blockMeta => sanitizeRpcBlock(blockMeta))
        self.recentBlocks.push(...blocks)
      })
    } catch (error) {
      console.error('Subscription error, fetch last 100 blocks', error) // tslint:disable-line:no-console
    }
  }),
}))
.actions(self => ({
  fetchAll: flow(function* fetchAll() {
    yield Promise.all([
      self.fetchGenesis(),
      self.fetchStatus(),
      self.fetchValidators(),
      self.subNewBlock(),
    ])
    yield self.fetchLast100Blocks()
  }),
}))
.views(self => ({
  get transactionsPerSecondLast100 () {
    const txsLast100 = sum(self.recentBlocks.map(block => block.numTxs))
    const sLast100 = sum(msBetween(self.recentBlocks.map(block => block.time))) / 1000
    return txsLast100 / sLast100
  },
  get blockFinalityLast100 () {
    return avg(msBetween(self.recentBlocks.map(block => block.time)))
  },
}))
.views(self => ({
  get transactionTimeLast100() {
    return self.blockFinalityLast100 / 2
  },
  get capacity() {
    return self.transactionsPerSecondLast100 / 10000
  },
}))

/**
 * Takes a block from rpc and extracts information to be stored in the store
 */
function sanitizeRpcBlock (rpcBlock: IRpcBlock | IRpcBlockMeta) {
  return {
    height: parseInt(rpcBlock.header.height, 10),
    numTxs: parseInt(rpcBlock.header.num_txs, 10),
    time: rpcBlock.header.time,
  }
}

async function fetchBlocks(min: number, max: number) {
  try {
    const { result }: { result: { block_metas: IRpcBlockMeta[], last_height: string } } =
      await http.get(tendermintRpcRest + `/blockchain?minHeight=${min}&maxHeight=${max}`)
    // console.log(result) // tslint:disable-line:no-console
    return result
  } catch (error) {
    console.error('Failed to fetch blocks', error) // tslint:disable-line:no-console
    return null
  }
}
