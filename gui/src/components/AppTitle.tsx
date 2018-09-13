import * as React from 'react'
import styled from 'styled-components'
import logo1x from '../images/thorchain_logo_white_text.png'
import logo2x from '../images/thorchain_logo_white_text@2x.png'

export const Container = styled.section`
  margin: 10px 15px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
`

export const H1 = styled.h1`
  margin: 0;
  position: absolute;
  visibility: hidden;
`

const Logo = styled.img``

const Separator = styled.div`
  width: 0px;
  height: 34px;
  border-style: solid;
  border-width: 1px;
  border-image-source: linear-gradient(to bottom, #33ff99, #00ccff);
  border-image-slice: 1;
  margin: 0 15px;
`

const SubTitle = styled.h2`
  font-family: "Open Sans";
  font-size: 18px;
  color: #ffffff;
`

export const AppTitle = () =>
  <Container>
    <H1>THORChain</H1>
    <Logo src={logo1x} srcSet={`${logo1x} 1x, ${logo2x} 2x`} alt="" />
    <Separator />
    <SubTitle>Block Explorer</SubTitle>
  </Container>
