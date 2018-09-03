import * as moment from 'moment'
import * as React from 'react'
import styled from 'styled-components'
import { formatNum } from '../helpers/formatNum'
import { IRecentTxMetrics } from '../interfaces/metrics'
import { IconClock } from './IconClock'
import { Label } from './Label'
import { Title } from './Title'

const Container = styled.div`
  margin: 0 -18px;
`

const Table = styled.div`
  display: table;
  table-layout: fixed;
  width: 100%;
  border-spacing: 18px;
`

const Tr = styled.div`
  display: table-row;
`

const Td = styled.div`
  display: table-cell;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const RecentTxs = ({ txs }: { txs: IRecentTxMetrics[] }) => <Container>
  <Table>
    {txs.map(tx => (
      <Tr key={`${tx.height}-${tx.index}`}>
        <Td style={{ width: 120 }}>
          <Title>Block</Title>
          <Label>{formatNum(tx.height)}</Label>
        </Td>
        <Td style={{ width: 40 }}>
          <Title>Type</Title>
          <Label>{tx.type}</Label>
        </Td>
        <Td style={{ width: 220 }}>
          <Title>From</Title>
          <Label>{tx.from}</Label>
        </Td>
        <Td style={{ width: 220 }}>
          <Title>To</Title>
          <Label>{tx.to}</Label>
        </Td>
        <Td style={{ width: 220 }}>
          <Title>Amount</Title>
          <Label>
            {tx.from_coins.amount} {tx.from_coins.denom}
            {tx.to_coins &&
              (tx.from_coins.amount !== tx.to_coins.amount || tx.from_coins.denom !== tx.to_coins.denom) && (
                <span>{tx.to_coins.amount} {tx.to_coins.denom}</span>
            )}
          </Label>
        </Td>
        <Td style={{ width: 200 }}>
          <Title><IconClock /></Title>
          <Label>> {moment(tx.time).toNow(true)} ago</Label>
        </Td>
      </Tr>
    ))}
  </Table>
</Container>
