// import * as djson from 'deterministic-json'
// import * as varstruct from 'varstruct'
import * as net from 'net'


export function socketTest(encodedTx: string) {

  const client = net.createConnection({ path: '/tmp/echo.sock' }, () => {
    // 'connect' listener
    console.log('connected to server!')
    client.write('world!\r\n')
  })
  client.on('data', (data) => {
    console.log(data.toString())
    client.end()
  })
  client.on('end', () => {
    console.log('disconnected from server')
  })


  // const buf = new Buffer(encodedTx, 'base64')

  // console.log(Array.from(buf))
  // return buf.slice(3).toString()
}

// const TxStruct = varstruct([
//   { name: 'data', type: varstruct.VarString(varstruct.UInt32BE) },
//   { name: 'nonce', type: varstruct.UInt32BE },
// ])

// export function decodeTx(txBuffer: string) {
//   const decoded = TxStruct.decode(txBuffer)
//   const tx = djson.parse(decoded.data)
//   return tx
// }

// decodeTx()

socketTest('abc')
