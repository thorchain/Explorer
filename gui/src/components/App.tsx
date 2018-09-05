import { observer } from 'mobx-react'
import * as moment from 'moment'
import * as React from 'react'
import { API_HOST } from '../config'
import { formatByteSize } from '../helpers/formatByteSize'
import { formatNum } from '../helpers/formatNum'
import { formatPercent } from '../helpers/formatPercent'
import { formatVersion } from '../helpers/formatVersion'
import { http } from '../helpers/http'
import { IMetrics, IRecentTxMetrics } from '../interfaces/metrics'
import { AppTitle } from './AppTitle'
import { BifröstButtonContainer } from './Bifr\u00F6stButtonContainer'
import { BifröstIconContainer } from './BifröstIconContainer'
import { Button } from './Button'
import { CapacityGauge } from './CapacityGauge'
import { Col } from './Col'
import { Container } from './Container'
import { FullWidth } from './FullWidth'
import { IconBitcoin } from './IconBitcoin'
import { IconEthereum } from './IconEthereum'
import { IconTime } from './IconTime'
import { Label } from './Label'
import { Loading } from './Loading'
import { Pane } from './Pane'
import { PaneHeader } from './PaneHeader'
import { PaneRow } from './PaneRow'
import { Placeholder } from './Placeholder'
import { RecentTxs } from './RecentTxs'
import { Title } from './Title'
import { TitleLabel } from './TitleLabel'

@observer
class App extends React.Component<object, object> {
  public state: {
    metrics: null | IMetrics
    recentTxs: IRecentTxMetrics[],
    recentTxsSize: number,
  } = { metrics: null, recentTxs: [], recentTxsSize: 5 }
  private intervals: NodeJS.Timer[] = []

  public async componentWillMount() {
    this.loadMetrics()
    this.loadRecentTxs()
    this.intervals.push(setInterval(this.loadMetrics, 2000))
    this.intervals.push(setInterval(this.loadRecentTxs, 2000))
  }

  public componentWillUnmount() {
    this.intervals.forEach(interval => clearInterval(interval))
  }

  public render() {
    if (this.state.metrics === null) { return <Loading /> }

    const { metrics: { network, software, transactions, validators }, recentTxs } = this.state

    return (
      <Container>
        <Col>
          <AppTitle />

          <Pane>
            <PaneHeader>Software</PaneHeader>

            <PaneRow>
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
            </PaneRow>
          </Pane>

          <Pane>
            <PaneHeader>Network</PaneHeader>

            <PaneRow>
              <TitleLabel>
                <Title>Block Height</Title>
                <Label>{formatNum(network.blockHeight!)}</Label>
              </TitleLabel>
              <TitleLabel>
                <Title>Time Online</Title>
                <Label>{moment(network.genesisTime!).toNow(true).toUpperCase()}</Label>
              </TitleLabel>
            </PaneRow>
            <PaneRow>
              <TitleLabel>
                <Title>Block Finality</Title>
                <Label><IconTime />{formatNum(network.blockFinalityLast100Blocks!) + 'ms'}</Label>
              </TitleLabel>
              <TitleLabel>
                <Title>TPS</Title>
                <Label>{formatNum(network.transactionsPerSecondLast100Blocks!)}</Label>
              </TitleLabel>
            </PaneRow>
            <PaneRow>
              <TitleLabel>
                <Title>Block Size</Title>
                <Label>{formatByteSize(network.blockSizeLast100Blocks!)}</Label>
              </TitleLabel>
            </PaneRow>
            <PaneRow>
              <TitleLabel>
                <Title>Capacity</Title>
                <CapacityGauge capacity={network.capacityLast100Blocks! * 1000} />
              </TitleLabel>
            </PaneRow>
          </Pane>
        </Col>

        <Col>
          <Pane>
            <PaneHeader>Validators</PaneHeader>

            <PaneRow>
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
            </PaneRow>
            <PaneRow>
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
                <Label>{formatPercent(validators.stakeLevel!)}</Label>
              </TitleLabel>
            </PaneRow>
            <PaneRow>
              <TitleLabel>
                <Title>Delegators</Title>
                <Label><Placeholder /></Label>
              </TitleLabel>
              <TitleLabel>
                <Title>Delegated Stake</Title>
                <Label>{formatNum(validators.delegatedStake!, 0, 'millions') + ' ᚱ'}</Label>
              </TitleLabel>
              <TitleLabel>
                <Title>Network Security</Title>
                <Label><Placeholder /></Label>
              </TitleLabel>
            </PaneRow>
            <PaneRow>
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
            </PaneRow>
          </Pane>

          <Pane>
            <PaneHeader center={true}>Bifröst Protocol Exchange</PaneHeader>

            <BifröstIconContainer>
              <IconEthereum />
              <IconBitcoin />
            </BifröstIconContainer>

            <BifröstButtonContainer>
              <Button>Coming Soon</Button>
            </BifröstButtonContainer>
          </Pane>
        </Col>

        <Col>
          <Pane>
            <PaneHeader>Transactions</PaneHeader>

            <PaneRow>
              <TitleLabel>
                <Title>Total</Title>
                <Label>{formatNum(transactions.totalTxCount!)}</Label>
              </TitleLabel>
              <TitleLabel>
                <Title>Total CLP Tx</Title>
                <Label>{formatNum(transactions.totalClpTxCount!)}</Label>
              </TitleLabel>
              <TitleLabel>
                <Title>Total Addresses</Title>
                <Label>{formatNum(transactions.totalAddresses!)}</Label>
              </TitleLabel>
            </PaneRow>
            <PaneRow>
              <TitleLabel>
                <Title>Ave Tx fee</Title>
                <Label><Placeholder /></Label>
              </TitleLabel>
              <TitleLabel>
                <Title>Ave CLP fee</Title>
                <Label><Placeholder /></Label>
              </TitleLabel>
              <TitleLabel />
            </PaneRow>
            <PaneRow>
              <TitleLabel>
                <Title>Total Transacted</Title>
                <Label>{formatNum(transactions.totalTransacted!, 1, 'millions') + ' ᚱ'}</Label>
              </TitleLabel>
              <TitleLabel>
                <Title>Total Exchanged</Title>
                <Label>{formatNum(transactions.totalExchanged!, 1, 'millions') + ' ᚱ'}</Label>
              </TitleLabel>
              <TitleLabel />
            </PaneRow>
            <PaneRow>
              <TitleLabel>
                <Title>Transaction Time</Title>
                <Label><IconTime />{formatNum(transactions.txTimeLast100Blocks!) + 'ms'}</Label>
              </TitleLabel>
              <TitleLabel>
                <Title>CLP Time</Title>
                <Label><IconTime />{formatNum(transactions.clpTimeLast100Blocks!) + 'ms'}</Label>
              </TitleLabel>
              <TitleLabel />
            </PaneRow>
          </Pane>
        </Col>

        <FullWidth>
          <Pane>
            <PaneHeader>Recent Transactions</PaneHeader>

            <RecentTxs txs={recentTxs} />
          </Pane>
        </FullWidth>

      </Container>
    )
  }

  private loadMetrics = async () => this.setState({ metrics: await http.get(API_HOST + '/metrics') })

  private loadRecentTxs = async () =>
    this.setState({ recentTxs: await http.get(API_HOST + `/recent-txs?size=${this.state.recentTxsSize}`) })
}

export default App
