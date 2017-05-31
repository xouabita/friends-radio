import React, {Component} from 'react'
import { connect } from 'react-redux'

import ReactPlayer from 'react-player'
import PlayButton from '../PlayButton'
import Thumbnail from '../Thumbnail'

import PrevIcon from 'react-icons/lib/io/ios-arrow-back'
import NextIcon from 'react-icons/lib/io/ios-arrow-forward'

import ReactionButton from '../ReactionButton'

import { play, pause, next, prev } from '../../actions/player.js'

import style from './style.styl'

const Queue = ({medias, next}) => (
  <div className={style.queue}>
    {
      medias.map((media, i) => (
        <div
          onClick={() => next(i + 1)}
          key={i}
          className={style.queueItem}>
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
      current: null,
      played: 0,
      seeking: false,
      duration: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current != this.state.current) {
      this.setState({
        current: nextProps.current
      })
    }
  }

  onSeekMouseDown = e => this.setState({seeking: true})
  onSeekChange = e => this.setState({played: parseFloat(e.target.value)})
  onSeekMouseUp = e => {
    this.setState({seeking: false})
    this.player.seekTo(parseFloat(e.target.value))
  }
  onProgress = ({played}) => this.setState({played})

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

    const prevStyle = !this.props.index > 0 ? { display: 'none' } : null
    const nextStyle = !this.props.queue.length ? { display: 'none' } : null


    const likeStatus = this.state.current && this.state.current.myReaction ?
      this.state.current.myReaction.type === 'LIKE' ? 'active' : 'inactive'
      :
      'normal'
    const dislikeStatus = this.state.current && this.state.current.myReaction ?
      this.state.current.myReaction.type === 'DISLIKE' ? 'active' : 'inactive'
      :
      'normal'

    const mediaId = (this.state.current || {}).id

    return (
      <div className={style.container}>
        <Thumbnail
          src={thumbnail}
          className={style.thumbnail}
        >
          <PrevIcon
            className={style.prevIcon}
            onClick={() => this.props.prev()}
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
            onClick={() => this.props.next()}
            style={nextStyle}
          />
          <ReactionButton
            type='dislike'
            className={style.reactionDislike}
            status={dislikeStatus}
            mediaId={mediaId}
          />
          <ReactionButton
            type='like'
            className={style.reactionLike}
            status={likeStatus}
            mediaId={mediaId}
          />
        </Thumbnail>
        <input
          type='range' min={0} max={1} step='any' value={this.state.played}
          onMouseDown={this.onSeekMouseDown}
          onChange={this.onSeekChange}
          onMouseUp={this.onSeekMouseUp}
          className={style.slider}
        />
        <p className={style.title}>{title}</p>
        <Queue medias={this.props.queue} next={this.props.next} />
        {
          this.state.current ?
            <ReactPlayer
              url={this.state.current.url}
              hidden={true}
              onEnded={() => this.props.next()}
              playing={this.props.playing}
              ref={player => this.player = player}
              onProgress={this.onProgress}
              onDuration={duration => this.setState({duration})}
              volume={1}
            />
          :
            undefined
        }
      </div>
    )
  }
}

const mapStateToProps = ({player, medias}) => {
  const list = medias[player.list]
  if (!list)
    return {
      playing: false,
      current: null,
      index: 0,
      queue: []
    }
  else
    return {
      playing: player.playing,
      current: list[player.current],
      index: player.current,
      queue: list.slice(player.current + 1, list.length),
      listName: player.list
    }
}

const mapDispatchToProps = (dispatch) => ({
  play: () => dispatch(play()),
  pause: () => dispatch(pause()),
  next: i => dispatch(next(i)),
  prev: i => dispatch(prev(i))
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)
