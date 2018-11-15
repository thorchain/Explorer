import * as React from 'react'
import styled from 'styled-components'
import { formatNum } from 'thorchain-info-common/helpers/formatNum'
import { ICLP } from 'thorchain-info-common/interfaces/metrics'
import { Label } from './Label'
import { Placeholder } from './Placeholder'
import { Title } from './Title'

const Container = styled.div`
  margin: 0 -18px;
  max-height: 280px;
  overflow-y: scroll;
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

export const CLPs = ({ clps }: { clps: ICLP[] }) => <Container>
  <Table>
    {clps.map(clp => (
      <Tr key={`${clp.clp.ticker}`}>
        <Td style={{ width: 120 }}>
          <Title>Pair</Title>
          <Label>RUNE: {clp.clp.ticker}</Label>
        </Td>
        <Td style={{ width: 180 }}>
          <Title>Pair Ratio</Title>
          <Label>{clp.account.RUNE} : {clp.account[clp.clp.ticker]}</Label>
        </Td>
        <Td style={{ width: 120 }}>
          <Title>Price ({clp.clp.ticker})</Title>
          <Label>{formatNum(clp.account.price, 5)}</Label>
        </Td>
        <Td style={{ width: 120 }}>
          <Title>24hr Volume</Title>
          <Label><Placeholder /></Label>
        </Td>
        <Td style={{ width: 120 }}>
          <Title>Transactions</Title>
          <Label>
            <Placeholder />
          </Label>
        </Td>
        <Td style={{ width: 120 }}>
          <Title>Liquidity Fee</Title>
          <Label><Placeholder /></Label>
        </Td>
      </Tr>
    ))}
  </Table>
</Container>
