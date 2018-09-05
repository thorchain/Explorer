import * as React from 'react'
import styled from 'styled-components'
import icon from '../images/icon-arrow-right.svg'

const Img = styled.img`
  width: 16px;
  height: 10px;
  object-fit: contain;
  /* margin-right: 0;
  position: relative;
  top: 6px; */
`

export const IconArrowRight = ({ style }: { style: React.CSSProperties }) => <Img src={icon} style={style} />
