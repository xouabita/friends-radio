import React from 'react'

import Navigation from './Navigation'
import Player from './Player'

import {Container, Row, Col} from 'reactstrap'
import {css} from 'glamor'

const style={}
const navHeight = 54
const playerWidth = 270
const navStyle = css({
  position: 'fixed',
  width: '100vw',
  zIndex: 100,
})
const pageStyle = css({
  paddingTop: navHeight,
  width: '100%',
  background: '#f7f7f9',
})
const contentStyle = css({
  width: `calc(100% - ${playerWidth}px + 50px)`,
  minHeight: `calc(100vh - ${navHeight}px)`,
})
const playerStyle = css({
  width: playerWidth,
  height: `calc(100vh - ${navHeight}px)`,
  position: 'fixed',
  top: navHeight,
  right: 0,
})

const Page = ({children}) => (
  <div>
    <Navigation className={navStyle} />
    <Row {...pageStyle}>
      <div {...contentStyle}>
        <Container>
          {children}
        </Container>
      </div>
      <div {...playerStyle}>
        <Player />
      </div>
    </Row>
  </div>
)

export default Page
