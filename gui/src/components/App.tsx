import { observer } from 'mobx-react'
import * as moment from 'moment'
import * as React from 'react'
import { formatNum } from '../helpers/formatNum'
import { formatPercent } from '../helpers/formatPercent'
import { IMetrics } from '../interfaces/metrics'
// tslint:disable-next-line:no-var-requires
const tempmetrics = require('../tempMetrics.json')
import { formatVersion } from '../helpers/formatVersion'
import { AppTitle } from './AppTitle'
import { Col } from './Col'
import { Container } from './Container'
import { Label } from './Label'
import { Pane } from './Pane'
import { PaneHeader } from './PaneHeader'
import { Placeholder } from './Placeholder'
import { Title } from './Title'
import { TitleLabel } from './TitleLabel'

@observer
class App extends React.Component<object, object> {
  public state: { metrics: null | IMetrics } = { metrics: tempmetrics }
  private interval: NodeJS.Timer

  public async componentWillMount() {
    // this.loadMetrics()
    // this.interval = setInterval(this.loadMetrics, 2000)
  }

  public componentWillUnmount() {
    clearInterval(this.interval)
  }

  public render() {
    // TODO: loader
    if (this.state.metrics === null) { return 'loading...' }

    const { clps, network, recentTxs, software, tokens, transactions, validators } = this.state.metrics

    // TODO:
    // tslint:disable-next-line:no-console
    console.log(clps, recentTxs, tokens)

    return (
      <Container>
        <Col>
          <AppTitle />

          <Pane>
            <PaneHeader>Software</PaneHeader>

            <TitleLabel>
              <Title>Testnet</Title>
              <Label>{software.testnet!.toUpperCase()}</Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Daemon</Title>
              <Label>{formatVersion(software.daemonVersion!)}</Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Explorer</Title>
              <Label>{formatVersion(software.explorerVersion!)}</Label>
            </TitleLabel>
          </Pane>

          <Pane>
            <PaneHeader>Network</PaneHeader>

            <TitleLabel>
              <Title>Block Height</Title>
              <Label>{formatNum(network.blockHeight!)}</Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Time Online</Title>
              <Label>{moment(network.genesisTime!).toNow(true).toUpperCase()}</Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Block Finality</Title>
              <Label>{formatNum(network.blockFinalityLast100Blocks!) + 'ms'}</Label>
            </TitleLabel>
            <TitleLabel>
              <Title>TPS</Title>
              <Label>{formatNum(network.transactionsPerSecondLast100Blocks!)}</Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Block Size</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Capacity</Title>
              <Label>{formatPercent(network.capacityLast100Blocks!)}</Label>
            </TitleLabel>
          </Pane>
        </Col>

        <Col>
          <Pane>
            <PaneHeader>Validators</PaneHeader>

            <TitleLabel>
              <Title>Validators</Title>
              <Label>{formatNum(validators.validatorCount!)}</Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Total Staked</Title>
              <Label>{formatNum(validators.totalStaked!, 0, 'millions') + ' ᚱ'}</Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Total Staked</Title>
              <Label>{formatNum(validators.totalStakedByValidators!, 0, 'millions') + ' ᚱ'}</Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Backup Validators</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Queued Stake</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Stake Level</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Delegators</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Delegated Stake</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Network Security</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Block Reward</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Total Block Rewards</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Inflation</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
          </Pane>
        </Col>

        <Col>
          <Pane>
            <PaneHeader>Transactions</PaneHeader>

            <TitleLabel>
              <Title>Total</Title>
              <Label>{formatNum(transactions.totalTxCount!)}</Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Total CLP Tx</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Total Addresses</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Ave Tx fee</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Ave CLP fee</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Total Transacted</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Total Exchanged</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
              <Title>Transaction Time</Title>
              <Label>{formatNum(transactions.txTimeLast100Blocks!) + 'ms'}</Label>
            </TitleLabel>
            <TitleLabel>
              <Title>CLP Time</Title>
              <Label><Placeholder /></Label>
            </TitleLabel>
          </Pane>
        </Col>
      </Container>
    )
  }

  // private loadMetrics = async () => this.setState({ metrics: await http.get(API_HOST + '/metrics') })
}

export default App
