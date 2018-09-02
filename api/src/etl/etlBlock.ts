import { exec } from 'child_process'
import { promisify } from 'util'
import { calcBase64ByteSize } from '../helpers/calcBase64ByteSize'
import { env } from '../helpers/env'
import { http } from '../helpers/http'
import { IStoredBlock, IStoredRecentTx } from '../interfaces/stored'
import { IRpcBlock } from '../interfaces/tendermintRpc'
import { ILcdDecodedTx } from '../interfaces/thorchainLcd'
import { ElasticSearchService } from '../services/ElasticSearch'
import { EtlService } from '../services/EtlService'
import { logger } from '../services/logger'

const promisedExec = promisify(exec)

export async function etlBlock (etlService: EtlService, esService: ElasticSearchService, height: number) {
  const extracted = await extract(height)
  const transformed = await transform(extracted)
  await load(etlService, esService, transformed)
}

async function extract (height: number): Promise<IRpcBlock> {
  const { result }: { result: { block: IRpcBlock } } =
    await http.get(env.TENDERMINT_RPC_REST + `/block?height=${height}`)

  return result.block
}

export async function transform (block: IRpcBlock): Promise<ITransformedBlock> {
  const result = {
    addresses: new Set<string>(),
    block: {
      height: parseInt(block.header.height, 10),
      numClpTxs: 0,
      numTxs: parseInt(block.header.num_txs, 10),
      size: block.data.txs ? block.data.txs.map(calcBase64ByteSize).reduce((sum, size) => sum + size, 0) : 0,
      time: block.header.time,
    },
    clpTransacted: {},
    recentTxs: [],
    totalTransacted: {},
  }

  if (block.data.txs) {
    await Promise.all(block.data.txs.map(transformTx(result)))
  }

  // TODO: convert currencies of clpTransacted and totalTransacted

  return result
}

export async function load(etlService: EtlService, esService: ElasticSearchService, trans: ITransformedBlock) {
  const bulkBody: any[] = []

  bulkBody.push({ index: { _index: 'blocks', _type: 'type', _id: `${trans.block.height}` } })
  bulkBody.push(trans.block)

  trans.addresses.forEach(address => {
    bulkBody.push({ index: { _index: 'addresses', _type: 'type', _id: address } })
    bulkBody.push({})
  })

  let index = 0
  trans.recentTxs.forEach(recentTxsInMsgs => recentTxsInMsgs.forEach(recentTx => {
    recentTx.index = index
    index++
    bulkBody.push({ index: { _index: 'recent-txs', _type: 'type' } })
    bulkBody.push(recentTx)
  }))

  // TODO: add clpTransacted
  // TODO: add totalTransacted

  await esService.client.bulk({ body: bulkBody }, (err, res) => {
    if (err) {
      logger.warn('Unexpected block etl bulk insert error, will restart etl service', err)
      // restart etl service
      etlService.stop()
      etlService.start()
    }
  })
}

const transformTx = (result: ITransformedBlock) => async (tx: string): Promise<void> => {
  // put recentTxs into result first, so order is maintained
  const recentTxs: IStoredRecentTx[] = []
  result.recentTxs.push(recentTxs)

  let stdout: string
  let stderr
  ({ stdout, stderr } = await promisedExec(`thorchaindebug tx "${tx}"`))

  if (stderr) { throw new Error(`Cound not transform tx, got error ${stderr}`) }

  const decodedTx: ILcdDecodedTx = JSON.parse(stdout!)

  if (decodedTx.type === 'auth/StdTx') {
    for (const msg of decodedTx.value.msg) {
      if (msg.type === 'cosmos-sdk/Send') {
        // input coins are enough for total transacted, output must match input
        msg.value.inputs.forEach(i => { i.coins.forEach(c => result.totalTransacted[c.denom] += Number(c.amount)) })
        // output addresses is enough, every address needs to have been the output of another before
        msg.value.outputs.forEach(o => result.addresses.add(o.address))

        // TODO split up for M:N txs each with different coins, right now these are ignored
        const inputs = msg.value.inputs
        const outputs = msg.value.outputs
        if (msg.value.inputs.length !== 1 || msg.value.outputs.length !== 1) { continue }
        if (inputs[0].coins.length !== 1 || outputs[0].coins.length !== 1) { continue }
        recentTxs.push({
          from: inputs[0].address,
          from_coins: inputs[0].coins[0],
          height: result.block.height,
          time: result.block.time,
          to: outputs[0].address,
          to_coins: outputs[0].coins[0],
          type: 'Tx',
        } as IStoredRecentTx)
      }
      else if (msg.type === 'clp/MsgTrade') { // TODO add bridged clp txs, should have same structure
        result.block.numClpTxs++

        // input coins are enough for clp transacted, output must match input
        result.clpTransacted[msg.value.FromTicker] += Number(msg.value.FromAmount)

        recentTxs.push({
          from: msg.value.Sender,
          from_coins: { amount: msg.value.FromAmount, denom: msg.value.FromTicker },
          height: result.block.height,
          time: result.block.time,
          to: msg.value.Sender,
          to_coins: { amount: 'TODO', denom: msg.value.ToTicker }, // TODO add amount
          type: 'CLP',
        } as IStoredRecentTx)
      }
    }
  }
}

interface ITransformedBlock {
  addresses: Set<string>
  block: IStoredBlock
  clpTransacted: { [denom: string]: number }
  recentTxs: IStoredRecentTx[][]
  totalTransacted: { [denom: string]: number }
}
