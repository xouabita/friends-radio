import React from 'react'
import style from './style.styl'
import { connect } from 'react-redux'
import { play, pause } from '../../actions/player.js'

import { Row } from 'reactstrap'
import Thumbnail from '../Thumbnail'
import PlayButton from '../PlayButton'

const Media = (media) => (
  <div className={style.card}>
    <Thumbnail
      src={media.thumbnail}
      className={style.thumbnail}
      active={media.playing ? true : undefined}
    >
      <PlayButton
        playing={media.playing} color='white'
        className={style.playButton}
        onClick={media.onPlay}
      />
    </Thumbnail>
    <div className={style.content}>
      <h5>{(media.artist ? `${media.artist} - ` : '') + media.title}</h5>
      <p>{media.description}</p>
      <p className={style.postedBy}>Posted by <span>{media.posted_by.name}</span></p>
    </div>
  </div>
)

const mapStateToProps = ({player}, ownProps) => ({
  playing: player.playing && player.list === ownProps.list &&
    ownProps.index === player.current
})

export default connect(mapStateToProps)(Media)
