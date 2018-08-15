import { observer } from 'mobx-react'
import * as React from 'react'
import { BlockchainStore } from '../models/blockchain'
import './App.css'

@observer
class App extends React.Component<{ store: typeof BlockchainStore.Type }, object> {
  public componentWillMount() {
    this.props.store.fetchAll()
  }

  public render() {
    const { store } = this.props

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">THOR!</h1>
        </header>

        <h2>Software</h2>
        <p>Testnet: {store.chainId}</p>

        <h2>Validators</h2>
        <p>Validators: {store.validatorCount}</p>
        <p>Total Staked: {store.totalStaked}</p>
        <p>Inflation: {store.inflation}</p>

        <h2>Validators</h2>
        <p>Transaction Time: {store.transactionTimeLast100}</p>

        <h2>Network</h2>
        <p>Block Height: {store.blockHeight}</p>
        <p>Time Online: {store.genesisTime}</p>
        <p>Block Finality: {store.blockFinalityLast100}</p>
        <p>TPS: {store.transactionsPerSecondLast100}</p>
        <p>Capacity: {store.capacity}</p>

        {store.recentBlocks.map(block => <p key={block.time}>{block.time}</p>)}
      </div>
    )
  }
}

export default App
