import * as React from 'react'
import styled from 'styled-components'

const ClockFace = styled.div`
  display: inline-block;
  top: 3px;
  position: relative;
  width: 12px;
  height: 12px;
  border: solid 1px #747b81;
  border-radius: 7px;
`

const Handles = styled.div`
  position: absolute;
  top: 3px;
  right: 3px;
  width: 3px;
  height: 3px;
  border: solid 1px #747b81;
  border-width: 0 0 1px 1px;
`

export const IconClock = () => <ClockFace><Handles /></ClockFace>
