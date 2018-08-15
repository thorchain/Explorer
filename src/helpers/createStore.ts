import { destroy } from 'mobx-state-tree'
import { connectReduxDevtools } from 'mst-middlewares'
import { BlockchainStore } from '../models/blockchain'

export let store: typeof BlockchainStore.Type

export function createStore(snapshot: object) {
  // kill old store to prevent accidental use and run clean up hooks
  if (store) { destroy(store) }

  // create new one
  store = BlockchainStore.create(snapshot)

  // connect devtools
  connectReduxDevtools(require('remotedev'), store)

  return store
}
