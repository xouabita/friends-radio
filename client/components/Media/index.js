import React from 'react'
import style from './style.styl'
import { connect } from 'react-redux'
import { play, pause } from '../../actions/player.js'

import { Row } from 'reactstrap'
import Truncate from 'react-truncate'
import Thumbnail from '../Thumbnail'
import PlayButton from '../PlayButton'

const Ô = ({children}) =>
  <Truncate ellipsis='…'>
    {children}
  </Truncate>

const Media = (media) => (
  <div className={style.card}>
    <Thumbnail
      src={media.thumbnail}
      className={style.thumbnail}
      active={media.playing}
    >
      <PlayButton
        playing={media.playing} color='white'
        className={style.playButton}
        onClick={() => media.playing ? media.pause() : media.play()}
      />
    </Thumbnail>
    <div className={style.content}>
      <h5><Ô>{media.title}</Ô></h5>
      <p><Ô>{media.description}</Ô></p>
    </div>
  </div>
)

const mapStateToProps = ({player}, ownProps) => ({
  playing: player.current && player.playing && player.current.id === ownProps.id
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  play: () => dispatch(play(ownProps)),
  pause: () => dispatch(pause())
})

export default connect(mapStateToProps, mapDispatchToProps)(Media)
