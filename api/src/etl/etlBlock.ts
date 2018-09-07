import { exec } from 'child_process'
import { promisify } from 'util'
import { calcBase64ByteSize } from '../helpers/calcBase64ByteSize'
import { env } from '../helpers/env'
import { http } from '../helpers/http'
import { IStoredBlock, IStoredRecentTx } from '../interfaces/stored'
import { IRpcBlock, IRpcBlockResults } from '../interfaces/tendermintRpc'
import { ILcdDecodedTx } from '../interfaces/thorchainLcd'
import { ElasticSearchService } from '../services/ElasticSearch'
import { EtlService } from '../services/EtlService'
import { logger } from '../services/logger'
import { ParallelPromiseLimiter } from '../services/ParallelPromiseLimiter'
import { extract as extractBlockResults } from './etlBlockResults'

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
  const result: ITransformedBlock = {
    addresses: new Set<string>(),
    block: {
      amountTransacted: 0,
      amountTransactedClp: 0,
      height: parseInt(block.header.height, 10),
      numClpTxs: 0,
      numTxs: parseInt(block.header.num_txs, 10),
      size: block.data.txs ? block.data.txs.map(calcBase64ByteSize).reduce((sum, size) => sum + size, 0) : 0,
      time: block.header.time,
    },
    recentTxs: [],
  }

  const cache: ITransformCache = { blockResults: null, amountTransacted: new Map<string, number>() }

  if (block.data.txs) {
    const limiter = new ParallelPromiseLimiter(10)

    for (let i = 0; i < block.data.txs.length; i++) {
      await limiter.push(() => transformTx(result, cache)(block.data.txs![i], i))
    }
  }

  // convert and add other currencies than RUNE of amountTransacted map to block
  for (const [denom, amount] of cache.amountTransacted) {
    if (denom === 'RUNE') {
      result.block.amountTransacted += amount
      continue
    }
    // TODO get current exchange rate
    // await http.get(env.TENDERMINT_RPC_REST + `/clp/${denom}?height=${result.block.height}`)
  }

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

  await esService.client.bulk({ body: bulkBody }, (err, res) => {
    if (err) {
      logger.warn('Unexpected block etl bulk insert error, will restart etl service', err)
      // restart etl service
      etlService.stop()
      etlService.start()
    }
  })
}

const transformTx = (result: ITransformedBlock, cache: ITransformCache) =>
  async (tx: string, index: number): Promise<void> => {

  // put recentTxs into result first, so order is maintained
  const recentTxs: IStoredRecentTx[] = []
  result.recentTxs.push(recentTxs)

  let decodedTx: ILcdDecodedTx
  try {
    let stdout: string
    let stderr
    ({ stdout, stderr } = await promisedExec(`thorchaindebug tx "${tx}"`, { timeout: 2000 }))

    decodedTx = JSON.parse(stdout!)
  } catch (e) {
    console.error(`Cound not decode and parse tx ${index} in block ${result.block.height}: ${tx}, got error: ${e}`)
    return
  }

  if (decodedTx.type === 'auth/StdTx') {
    for (const msg of decodedTx.value.msg) {
      if (msg.type === 'cosmos-sdk/Send') {
        // input coins are enough for total transacted, output must match input
        msg.value.inputs.forEach(i => { i.coins.forEach(c => cache.amountTransacted[c.denom] += Number(c.amount)) })
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
      } else if (msg.type === 'clp/MsgTrade') {
        result.block.numClpTxs++

        // get to amount and rune transacted
        if (cache.blockResults === null) {
          cache.blockResults = await extractBlockResults(result.block.height)
        }

        const transformedBlockResults = await transformBlockResults(result, cache.blockResults, index)

        result.block.amountTransactedClp += transformedBlockResults.runeTransacted

        recentTxs.push({
          from: msg.value.Sender,
          from_coins: { amount: msg.value.FromAmount, denom: msg.value.FromTicker },
          height: result.block.height,
          time: result.block.time,
          to: msg.value.Sender,
          to_coins: { amount: `${transformedBlockResults.toTokenReceived}`, denom: msg.value.ToTicker },
          type: 'CLP',
        } as IStoredRecentTx)
      }
    }
  }
}

function transformBlockResults (result: ITransformedBlock, blockResults: IRpcBlockResults, index: number):
  ITransformedBlockResultsMsg {
  const log = blockResults.results.DeliverTx[index].log
  if (!log) { return { fromTokenSpent: 0, runeTransacted: 0, toTokenReceived: 0 } }
  try {
    const logJSON = JSON.parse(log.split('json')[1]) as ITransformedBlockResultsMsg
    return logJSON
  } catch (e) {
    console.error(`Cound not parse block result msg for tx ${index} in block ${result.block.height}: ${log}, `
      + `got error: ${e}`)
    throw e
  }
}

interface ITransformCache {
  blockResults: null | IRpcBlockResults,
  amountTransacted: Map<string, number>,
}

interface ITransformedBlock {
  addresses: Set<string>
  block: IStoredBlock
  recentTxs: IStoredRecentTx[][]
}

interface ITransformedBlockResultsMsg {
  fromTokenSpent: number,
  runeTransacted: number,
  toTokenReceived: number,
}
