import * as React from 'react'
import styled from 'styled-components'
import icon from '../images/bitcoin-button.svg'

const Img = styled.img`
  width: 128px;
  height: 128px;
  object-fit: contain;
`

export const IconBitcoin = () => <Img src={icon} />
