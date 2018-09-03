import * as React from 'react'
import styled from 'styled-components'
import icon from '../images/icon-time.svg'

const Img = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
  margin-right: 8px;
  position: relative;
  top: 6px;
`

export const IconTime = () => <Img src={icon} />
