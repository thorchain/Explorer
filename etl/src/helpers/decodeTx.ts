import * as net from 'net'
import { logger } from '../services/logger'

export function decodeTx(encodedTx: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({ path: '/tmp/thorchaindebug-tx-decoding.sock' }, () => {
      // 'connect' listener
      // logger.debug('thorchaindebug tx-decoding-server: connected')
      client.write(encodedTx)
    })
    client.on('data', (data) => {
      // logger.debug('thorchaindebug tx-decoding-server:\n' + 'data.toString())
      client.end()
      resolve(data.toString())
    })
    client.on('end', () => {
      // logger.debug('thorchaindebug tx-decoding-server: disconnected')
    })
    client.on('error', (err) => {
      logger.error('thorchaindebug tx-decoding-server: error:', err)
      reject(err)
    })
  })
}
