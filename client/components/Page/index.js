import React from 'react'

import Navigation from '../Navigation'
import style from './style.styl'

import { Container, Row, Col } from 'reactstrap'

const Page = ({children}) => (
  <div>
    <Navigation className={style.nav} />
    <Row className={style.content}>
      <Col xs='9'>
        <Container>
          {children}
        </Container>
      </Col>
    </Row>
  </div>
)

export default Page
