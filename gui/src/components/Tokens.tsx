import * as React from 'react'
import styled from 'styled-components'

import { ICLP } from '../interfaces/metrics'
import { Label } from './Label'
import { Pane } from './Pane'
import { PaneHeader } from './PaneHeader'
import { PaneRow } from './PaneRow'
import { Placeholder } from './Placeholder'
import { Title } from './Title'
import { TitleLabel } from './TitleLabel'

const Container = styled.div`
  max-height: 280px;
  overflow-y: scroll;
`

export const Tokens = ({ clps }: { clps: ICLP[] }) => <Pane>
    <PaneHeader>Tokens ({clps.length + 1})</PaneHeader>
    <Container>
        <PaneRow>
            <TitleLabel>
            <Title>1. Rune (RUNE)</Title>
            <Label>2000000000</Label>
            </TitleLabel>
            <TitleLabel>
            <Title>&nbsp;</Title>
            <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
            <Title>&nbsp;</Title>
            <Label><Placeholder /></Label>
            </TitleLabel>
        </PaneRow>
        {clps.map((clp, index) => <PaneRow key={clp.clp.ticker}>
            <TitleLabel>
            <Title>{index + 1}. {clp.clp.name} ({clp.clp.ticker})</Title>
            <Label>{clp.clp.currentSupply}</Label>
            </TitleLabel>
            <TitleLabel>
            <Title>&nbsp;</Title>
            <Label><Placeholder /></Label>
            </TitleLabel>
            <TitleLabel>
            <Title>&nbsp;</Title>
            <Label><Placeholder /></Label>
            </TitleLabel>
        </PaneRow>)}
    </Container>
</Pane>

