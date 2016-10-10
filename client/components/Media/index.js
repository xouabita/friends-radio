import React from 'react'
import style from './style.styl'
import { connect } from 'react-redux'
import { play } from '../../actions/player.js'

import { Row } from 'reactstrap'
import Truncate from 'react-truncate'

const Ô = ({children}) =>
  <Truncate ellipsis='…'>
    {children}
  </Truncate>

const Media = (media) => (
  <div className={style.card}>
    <div className={style.thumbnail}>
      <img
        src={media.thumbnail}
        onClick={media.play}
      />
    </div>
    <div className={style.content}>
      <h5><Ô>{media.title}</Ô></h5>
      <p><Ô>{media.description}</Ô></p>
    </div>
  </div>
)

const mapStateToProps = ({player}) => ({
  current: player.current
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  play: () => dispatch(play(ownProps))
})

export default connect(mapStateToProps, mapDispatchToProps)(Media)
