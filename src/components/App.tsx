import { observer } from 'mobx-react'
import * as moment from 'moment'
import * as React from 'react'
import { formatNum } from '../helpers/formatNum'
import { formatPercent } from '../helpers/formatPercent'
import { BlockchainStore } from '../models/blockchain'
import { AppTitle } from './AppTitle'
import { Col } from './Col'
import { Container } from './Container'
import { Label } from './Label'
import { Pane } from './Pane'
import { PaneHeader } from './PaneHeader'
import { Title } from './Title'
import { TitleLabel } from './TitleLabel'

@observer
class App extends React.Component<{ store: typeof BlockchainStore.Type }, object> {
  public render() {
    const { store } = this.props

    console.log(store.blockHeight !== null ? formatNum(store.blockHeight) : null) // tslint:disable-line:no-console

    return (
      <Container>
        <Col>
          <AppTitle />

          <Pane>
            <PaneHeader>Software</PaneHeader>
            <TitleLabel>
              <Title>Testnet</Title>
              <Label>{store.chainId !== null ? store.chainId.toUpperCase() : 'TODO'}</Label>
            </TitleLabel>
          </Pane>

          <Pane>
            <PaneHeader>Network</PaneHeader>

            <TitleLabel>
              <Title>Block Height</Title>
              <Label>{store.blockHeight !== null ? formatNum(store.blockHeight) : 'TODO'}</Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Time Online</Title>
              <Label>
                {store.genesisTime !== null ? moment(store.genesisTime).toNow(true).toUpperCase() : 'TODO'}
              </Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Block Finality</Title>
              <Label>
                {store.blockFinalityLast100 !== null ? formatNum(store.blockFinalityLast100) + 'ms' : 'TODO'}
              </Label>
            </TitleLabel>
            <TitleLabel>
              <Title>TPS</Title>
              <Label>
                {store.transactionsPerSecondLast100 !== null ? formatNum(store.transactionsPerSecondLast100) : 'TODO'}
              </Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Capacity</Title>
              <Label>{store.capacity !== null ? formatPercent(store.capacity) : 'TODO'}</Label>
            </TitleLabel>
          </Pane>
        </Col>

        <Col>
          <Pane>
            <PaneHeader>Validators</PaneHeader>

            <TitleLabel>
              <Title>Validators</Title>
              <Label>{store.validatorCount !== null ? formatNum(store.validatorCount) : 'TODO'}</Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Total Staked</Title>
              <Label>{store.totalStaked !== null ? formatNum(store.totalStaked, 0, 'millions') + ' ᚱ' : 'TODO'}</Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Inflation</Title>
              <Label>{store.inflation !== null ? formatPercent(store.inflation) : 'TODO'}</Label>
            </TitleLabel>
          </Pane>
        </Col>

        <Col>
          <Pane>
            <PaneHeader>Transactions</PaneHeader>

            <TitleLabel>
              <Title>Transaction Time</Title>
              <Label>
                {store.transactionTimeLast100 !== null ? formatNum(store.transactionTimeLast100) + 'ms' : 'TODO'}
              </Label>
            </TitleLabel>
          </Pane>
        </Col>
      </Container>
    )
  }
}

export default App
