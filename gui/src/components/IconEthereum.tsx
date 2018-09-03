import * as React from 'react'
import styled from 'styled-components'
import icon from '../images/ethereum-button.svg'

const Img = styled.img`
  width: 128px;
  height: 128px;
  object-fit: contain;
`

export const IconEthereum = () => <Img src={icon} />
