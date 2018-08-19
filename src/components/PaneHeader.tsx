import styled from 'styled-components'
import { colors } from '../constants/colors'

export const PaneHeader = styled.h2`
  font-family: "Exo 2";
  font-weight: 500;
  font-size: 20px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  max-width: 400px;
  margin: 0 0 7px 0;
  padding: 0 0 6px 0;
  border-width: 0;
  border-bottom: 1px solid #18E4CF;
  border-image: linear-gradient(to right, ${colors.lightningBlue}, ${colors.yggdrasilGreen}) 1;
`
