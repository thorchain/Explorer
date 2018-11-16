import * as React from 'react'
import styled from 'styled-components'
import { formatPercent } from 'thorchain-info-common/build/helpers/formatPercent'
import { Label } from './Label'

const Container = styled.div`
  position: relative;
  width: 116px;
  height: 58px;
  overflow: hidden;
  margin-top: 20px;
`

const Path = styled.div`
  position: absolute;
  width: 116px;
  height: 58px;
  background: #49525a;
  border-radius: 100px 100px 0 0;
`

const Active = styled.div<{ capacity: number }>`
  position: absolute;
  width: 116px;
  height: 58px;
  transform: rotate(${props => -180 + props.capacity * 180 }deg);
  transform-origin: bottom;
  background: linear-gradient(to bottom, #33ff99, #00ccff);
  border-radius: 100px 100px 0 0;
`

const borderWidth = 6

const Overlay = styled.div`
  position: absolute;
  top: ${borderWidth}px;
  left: ${borderWidth}px;
  width: ${116 - borderWidth * 2}px;
  height: ${58 - borderWidth}px;
  background: #1C2731;
  border-radius: 100px 100px 0 0;
`

const GaugeLabel = styled(Label)`
  position: relative;
  text-align: center;
  margin-top: 28px;
`

export const CapacityGauge = ({ capacity }: { capacity: number }) => (
  <Container>
    <Path />
    <Active capacity={capacity > 1 ? 1 : capacity} />
    <Overlay />
    <GaugeLabel>{formatPercent(capacity)}</GaugeLabel>
  </Container>
)
