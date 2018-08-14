import { observer } from 'mobx-react'
import * as React from 'react'
import { BlockchainStore } from '../models/blockchain'
import './App.css'

@observer
class App extends React.Component<{ store: typeof BlockchainStore.Type }, object> {
  public fetch = () => this.props.store.fetchStatus()

  public render() {
    const { height, state } = this.props.store

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">THOR!</h1>
        </header>
        <button onClick={this.fetch}>Fetch</button>
        State: {state}
        Height: {height}
      </div>
    )
  }
}

export default App
