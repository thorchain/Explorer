import styled from 'styled-components'
import { colors } from '../constants/colors'

export const PaneHeader = styled.h2<{ center?: boolean }>`
  font-family: "Exo 2";
  font-weight: 500;
  font-size: 20px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  max-width: 400px;
  margin: 0 0 3px 0;
  padding: 0 0 8px 0;
  border-width: 0;
  border-bottom: 1px solid #18E4CF;
  border-image: linear-gradient(to right, ${colors.lightningBlue}, ${colors.yggdrasilGreen}) 1;
  ${p => p.center && 'text-align: center;'}
`
