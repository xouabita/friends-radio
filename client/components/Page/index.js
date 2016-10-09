import React from 'react'

import Navigation from '../Navigation'
import Player from '../Player'
import style from './style.styl'

import { Container, Row, Col } from 'reactstrap'

const Page = ({children}) => (
  <div>
    <Navigation className={style.nav} />
    <Row className={style.page}>
      <div className={style.content}>
        <Container>
          {children}
        </Container>
      </div>
      <div className={style.player}>
        <Player />
      </div>
    </Row>
  </div>
)

export default Page
