import { destroy, getSnapshot } from 'mobx-state-tree'
import { connectReduxDevtools } from 'mst-middlewares'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './components/App'
import './index.css'
import { BlockchainStore } from './models/blockchain'

const initialState = {}
let store: typeof BlockchainStore.Type

export function createStore(snapshot: object) {
  // kill old store to prevent accidental use and run clean up hooks
  if (store) { destroy(store) }

  // create new one
  store = BlockchainStore.create(snapshot)

  // connect devtools
  connectReduxDevtools(require('remotedev'), store)

  return store
}

function renderApp(CurrentApp: typeof App, currentStore: typeof BlockchainStore.Type) {
  ReactDOM.render(<CurrentApp store={currentStore} />, document.getElementById('root'))
}

// Initial render
renderApp(App, createStore(initialState))

// Connect HMR
if ((module as any).hot) {
  (module as any).hot.accept(['./models/blockchain'], () => {
    // Store definition changed, recreate a new one from old state
    renderApp(App, createStore(getSnapshot(store)))
  });

  (module as any).hot.accept(['./components/App'], () => {
    // Componenent definition changed, re-render app
    renderApp(App, store)
  })
}
