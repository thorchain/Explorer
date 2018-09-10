import { env } from './helpers/env'
import { http } from './helpers/http'
import { ElasticSearchService } from './services/ElasticSearch'

const blocks = new Map<number, { height: number, numTxs: number, time: string }>()

async function start () {
  await getBlocks()

  const lowestHeightWeDoNotHave = blocks.values().next().value.height - blocks.size
  const esService = new ElasticSearchService()

  for (let i = lowestHeightWeDoNotHave; i > 0; i -= 20) {
    await getBlocks(i)
    await load(esService)
    blocks.clear()
  }
}

async function getBlocks (lowestHeightWeDoNotHave?: number) {
  let url = `${env.TENDERMINT_RPC_REST}/blockchain`
  if (lowestHeightWeDoNotHave) {
    const min = Math.max(lowestHeightWeDoNotHave - 20 + 1, 1)
    const max = lowestHeightWeDoNotHave
    url += `?minHeight=${min}&maxHeight=${max}`

    console.log(`will get blocks between ${min} and ${max}`)
  }

  const blockchain = await http.get(url)

  for (const blockMeta of blockchain.result.block_metas) {
    const height = parseInt(blockMeta.header.height, 10)
    const numTxs = parseInt(blockMeta.header.num_txs, 10)
    blocks.set(height, { height, numTxs, time: blockMeta.header.time })
  }
}

async function load(esService: ElasticSearchService) {
  const bulkBody: any[] = []

  blocks.forEach(block => {
    bulkBody.push({ index: { _index: 'committed-blocks', _type: 'type', _id: `${block.height}` } })
    bulkBody.push(block)
  })

  await esService.client.bulk({ body: bulkBody }, (err, res) => {
    if (err) {
      console.error('Unexpected block etl bulk insert error', err)
    }
  })
}

void start()
