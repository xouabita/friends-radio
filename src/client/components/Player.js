import React, {Component} from 'react'
import { connect } from 'react-redux'

import ReactPlayer from 'react-player'
import PlayButton from './PlayButton'
import Thumbnail from './Thumbnail'

import PrevIcon from 'react-icons/lib/io/ios-arrow-back'
import NextIcon from 'react-icons/lib/io/ios-arrow-forward'
import RangeSlider from 'react-rangeslider'

import ReactionButton from './ReactionButton'
import playerWidth from '../styles/playerWidth'

import { play, pause, next, prev } from '../actions/player.js'

import glamorous from 'glamorous'
import Queue from './Queue'

const margin = 20
const thumbSize = playerWidth - 2 * margin
const handleSize = 12
const playButtonSize = 90
const controlButtonSize = playButtonSize * .8
const reactionSize = playButtonSize * .7

function line(color, from, to) {
  from = from || 40
  to = to || 100 - from
  const transparent = 'rgba(0, 0, 0, 0)'
  return `linear-gradient(
    top,
    ${transparent} ${from - 1}%,
    ${color} ${from}%,
    ${color} ${to}%,
    ${transparent} ${to + 1}%
  )`
}

const Slider = glamorous(RangeSlider)({
  width: thumbSize,
  margin: '10px auto',
  display: 'block',
  height: handleSize,
  background: line('rgba(0, 0, 0, .2)'),
  position: 'relative',
  '& .rangeslider__handle': {
    height: handleSize,
    width: handleSize,
    borderRadius: handleSize / 2,
    background: 'rgb(127, 127, 127)',
    position: 'absolute',
    transform: 'translateY(-50%)',
    top: '50%',
  }
})

const Container = glamorous.div({
  width: '100%',
  height: '100%',
  background: 'white',
  padding: '20px 0 0',
  borderLeft: 'solid 2px rgba(0, 0, 0, .05)',
  display: 'flex',
  flexDirection: 'column',
})

const PlayerThumb = glamorous(Thumbnail)({
  width: thumbSize,
  height: thumbSize,
  margin: 'auto',
  position: 'relative',
})

const Title = glamorous.p({
  fontSize: 15,
  width: thumbSize,
  margin: '10px auto',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
})

const Play = glamorous(PlayButton)({
  width: playButtonSize,
  height: playButtonSize,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  ':hover': {cursor: 'pointer'},
})

const controlStyle = {
  position: 'absolute',
  height: controlButtonSize,
  width: controlButtonSize,
  color: 'white',
  top: '50%',
  transform: 'translateY(-50%)',
  ':hover': {cursor: 'pointer'}
}
const Prev = glamorous(PrevIcon)(controlStyle)
const Next = glamorous(NextIcon)({
  ...controlStyle,
  right: 0,
})

const Reaction = glamorous(ReactionButton)({
  position: 'absolute',
  height: reactionSize,
  width: reactionSize,
  bottom: margin,
})
function Like() {
  const Styled = glamorous(Reaction)({right: margin})
  return <Styled type="like"/>
}
function Dislike() {
  const Styled = glamorous(Reaction)({left: margin})
  return <Styled type="dislike"/>
}

class Player extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: null,
      played: 0,
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

  onSeekChange = value => this.setState({played: value})
  onSeekChangeComplete = () => this.player.seekTo(this.state.played)
  onProgress = ({played}) => this.setState({played})
  onPlay = () => this.props.playing ?
    this.props.pause()
  : this.props.play()

  render() {
    const thumbnail = this.state.current ?
      this.state.current.thumbnail
    :
      'http://www.pandora.com/img/no_album_art.png'

    const title = this.state.current ?
      this.state.current.title : ''

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
      <Container>
        <PlayerThumb src={thumbnail}>
          <Prev onClick={() => this.props.prev()} style={prevStyle}/>
          <Play
            playing={this.props.playing}
            onClick={this.onPlay}
            color='white'
          />
          <Next onClick={() => this.props.next()} style={nextStyle}/>
          <Dislike status={dislikeStatus} mediaId={mediaId}/>
          <Like status={likeStatus} mediaId={mediaId}/>
        </PlayerThumb>
        <Slider
          tooltip={false}
          min={0}
          max={1}
          step={0.0000001}
          value={this.state.played}
          onChange={this.onSeekChange}
          onChangeComplete={this.onSeekChangeComplete}
        />
        <Title>{title}</Title>
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
      </Container>
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
