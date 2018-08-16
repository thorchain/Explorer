import * as React from 'react'
import styled from 'styled-components'
import logo1x from '../images/thorchain_logo_white_text.png'
import logo2x from '../images/thorchain_logo_white_text@2x.png'

export const Container = styled.section`
  margin: 10px 15px;
  display: flex;
  position: relative;
`

export const H1 = styled.h1`
  margin: 0;
  position: absolute;
  visibility: hidden;
`

const Logo = styled.img``

export const AppTitle = () =>
  <Container>
    <H1>THORChain</H1>
    <Logo src={logo1x} srcSet={`${logo1x} 1x, ${logo2x} 2x`} alt="" />
  </Container>
