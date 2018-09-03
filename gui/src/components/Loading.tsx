import * as React from 'react'
import styled from 'styled-components'
import logo1x from '../images/thorchain_logo_white_text.png'
import logo2x from '../images/thorchain_logo_white_text@2x.png'

const Container = styled.div`
  height: 100vh;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Logo = styled.img`
  margin-bottom: 50px;
`

export const Loading = () => <Container>
  <Logo src={logo1x} srcSet={`${logo1x} 1x, ${logo2x} 2x`} alt="" />
  LOADING...
</Container>
