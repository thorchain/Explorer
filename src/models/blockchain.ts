import { flow, types } from 'mobx-state-tree'
import { tendermintRpcRest } from '../config'
import { http } from '../helpers/http'

export const BlockchainStore = types.model({
  height: types.maybe(types.number),
  state: types.maybe(types.enumeration('State', ['pending', 'done', 'error'])),
})
.actions(self => ({
  fetchStatus: flow(function* fetchStatus() {

    // tslint:disable-next-line:no-console
    console.log('go')
    self.state = 'pending'
    try {
      const response = yield http.get(tendermintRpcRest + '/status')
      // tslint:disable-next-line:no-console
      console.log(response)
      self.height = parseInt(response.result.sync_info.latest_block_height, 10)
      self.state = 'done'
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error('Failed to fetch projects', error)
      self.state = 'error'
    }
  }),
}))
