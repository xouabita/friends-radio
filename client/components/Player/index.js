import React, {Component, PropTypes as t} from 'react'
import { connect } from 'react-redux'

import ReactPlayer from 'react-player'
import PlayButton from '../PlayButton'
import Thumbnail from '../Thumbnail'

import PrevIcon from 'react-icons/lib/io/ios-arrow-back'
import NextIcon from 'react-icons/lib/io/ios-arrow-forward'

import { play, pause, next, prev } from '../../actions/player.js'

import style from './style.styl'

const Queue = ({medias}) => (
  <div className={style.queue}>
    {
      medias.map((media, i) => (
        <div key={i} className={style.queueItem}>
          <Thumbnail
            src={media.thumbnail}
            className={style.queueThumbnail}
            active={false}
          />
          <p>{media.title}</p>
        </div>
      ))
    }
  </div>
)

class Player extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current != this.props.current) {
      this.setState({
        current: nextProps.current
      })
    }
  }

  render() {
    const thumbnail = this.state.current ?
      this.state.current.thumbnail
    :
      'http://www.pandora.com/img/no_album_art.png'

    const title = this.state.current ?
      this.state.current.title : ''

    const thumbnailStyle = {
      backgroundImage: `url(${thumbnail})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center'
    }

    const prevStyle = !this.props.history.length ? { display: 'none' } : null
    const nextStyle = !this.props.queue.length ? { display: 'none' } : null

    return (
      <div className={style.container}>
        <Thumbnail
          src={thumbnail}
          className={style.thumbnail}
        >
          <PrevIcon
            className={style.prevIcon}
            onClick={this.props.prev}
            style={prevStyle}
          />
          <PlayButton
            className={style.playButton}
            playing={this.props.playing}
            onClick={() => this.props.playing ? this.props.pause() : this.props.play()}
            color='white'
          />
          <NextIcon
            className={style.nextIcon}
            onClick={this.props.next}
            style={nextStyle}
          />
        </Thumbnail>
        <p className={style.title}>{title}</p>
        <Queue medias={this.props.queue} />
        {
          this.state.current ?
            <ReactPlayer
              url={this.state.current.url}
              hidden={true}
              onEnded={this.props.next}
              playing={this.props.playing}
            />
          :
            undefined
        }
      </div>
    )
  }
}

const mediaType = t.shape({
  thumbnail: t.string,
  url: t.string.isRequired,
  title: t.string.isRequired
})

Player.propTypes = {
  playing: t.bool.isRequired,
  history: t.arrayOf(mediaType),
  current: mediaType,
  queue: t.arrayOf(mediaType)
}

const mapStateToProps = ({player}) => ({
  ...player
})

const mapDispatchToProps = (dispatch) => ({
  play: () => dispatch(play()),
  pause: () => dispatch(pause()),
  next: () => dispatch(next()),
  prev: () => dispatch(prev())
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)
