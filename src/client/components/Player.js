import React, {Component} from "react"
import {connect} from "react-redux"

import SoundcloudPlayer from "react-player/lib/players/SoundCloud"
import YoutubePlayer from "react-player/lib/players/YouTube"
import ReactPlayer from "react-player"

import PlayButton from "./PlayButton"
import Thumbnail from "./Thumbnail"

import PrevIcon from "react-icons/lib/io/ios-arrow-back"
import NextIcon from "react-icons/lib/io/ios-arrow-forward"
import RangeSlider from "react-rangeslider"

import ReactionButton from "./ReactionButton"
import playerWidth from "../styles/playerWidth"

import {play, pause, setCurrent} from "../actions/player.js"

import glamorous, {Div} from "glamorous"
import Queue from "./Queue"

const margin = 20
const thumbSize = playerWidth - 2 * margin
const handleSize = 12
const playButtonSize = 90
const controlButtonSize = playButtonSize * 0.8
const reactionSize = playButtonSize * 0.7

function line(color, from, to) {
  from = from || 40
  to = to || 100 - from
  const transparent = "rgba(0, 0, 0, 0)"
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
  margin: "10px auto",
  display: "block",
  height: handleSize,
  background: line("rgba(0, 0, 0, .2)"),
  position: "relative",
  "& .rangeslider__handle": {
    height: handleSize,
    width: handleSize,
    borderRadius: handleSize / 2,
    background: "rgb(127, 127, 127)",
    position: "absolute",
    transform: "translateY(-50%)",
    top: "50%",
  },
})

const Container = glamorous.div({
  width: "100%",
  height: "100%",
  background: "white",
  padding: "20px 0 0",
  borderLeft: "solid 2px rgba(0, 0, 0, .05)",
  display: "flex",
  flexDirection: "column",
})

export const PlayerThumb = glamorous(Thumbnail)({
  width: thumbSize,
  height: thumbSize,
  margin: "auto",
  position: "relative",
})

export const Title = glamorous.p({
  fontSize: 15,
  width: thumbSize,
  margin: "10px auto",
  fontWeight: "bold",
  whiteSpace: "nowrap",
  overflow: "hidden",
})

export const Play = glamorous(PlayButton)({
  width: playButtonSize,
  height: playButtonSize,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  ":hover": {cursor: "pointer"},
})

const controlStyle = {
  position: "absolute",
  height: controlButtonSize,
  width: controlButtonSize,
  color: "white",
  top: "50%",
  transform: "translateY(-50%)",
  ":hover": {cursor: "pointer"},
}
export const Prev = glamorous(PrevIcon)(controlStyle)
export const Next = glamorous(NextIcon)({
  ...controlStyle,
  right: 0,
})

const Reaction = glamorous(ReactionButton)({
  position: "absolute",
  height: reactionSize,
  width: reactionSize,
  bottom: margin,
})

export function Like(props) {
  const Styled = glamorous(Reaction)({right: margin})
  return <Styled type="like" {...props} />
}
export function Dislike(props) {
  const Styled = glamorous(Reaction)({left: margin})
  return <Styled type="dislike" {...props} />
}

export class Player extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: null,
      played: 0,
      duration: 0,
    }
  }

  get activePlayer() {
    if (YoutubePlayer.canPlay(this.url)) {
      return this.youtubePlayer
    } else if (SoundcloudPlayer.canPlay(this.url)) {
      return this.soundcloudPlayer
    }
  }
  onSeekChange = value => this.setState({played: value})
  onSeekChangeComplete = () => this.activePlayer.seekTo(this.state.played)

  get onPlay() {
    return this.props.playing ? this.props.pause : this.props.play
  }

  get url() {
    return (this.props.current || {}).url
  }

  get activeProps() {
    return {
      url: this.url,
      hidden: true,
      onEnded: () => this.next(),
      playing: this.props.playing,
      onProgress: ({played}) => this.setState({played}),
      onDuration: duration => this.setState({duration}),
      volume: 1,
    }
  }

  get youtubeProps() {
    if (YoutubePlayer.canPlay(this.url)) {
      return this.activeProps
    } else {
      return {
        url: "https://youtu.be/RxljKS5rc7w",
        volume: 0,
        playing: true,
      }
    }
  }

  get soundcloudProps() {
    if (SoundcloudPlayer.canPlay(this.url)) {
      return this.activeProps
    } else {
      return {
        url: "https://soundcloud.com/miami-nights-1984/accelerated",
        playing: false,
      }
    }
  }

  isNotDisliked(edge) {
    return (edge.node.myReaction || {}).type !== "DISLIKE"
  }

  next() {
    const {queue, setCurrent} = this.props
    const index = queue.findIndex(this.isNotDisliked)
    if (index >= 0) setCurrent(queue[index].cursor)
    else setCurrent(null)
  }

  prev() {
    const {history, setCurrent} = this.props
    let index = history.length - 1
    while (index > -1 && !this.isNotDisliked(history[index])) {
      index--
    }
    if (index >= 0) setCurrent(history[index].cursor)
    else setCurrent(null)
  }

  get thumbnail() {
    return this.props.current
      ? this.props.current.thumbnail
      : "http://www.pandora.com/img/no_album_art.png"
  }

  get title() {
    return this.props.current ? this.props.current.title : ""
  }

  get history() {
    return this.props.history || []
  }

  get queue() {
    return this.props.queue || []
  }

  get prevStyle() {
    return !this.history.length ? {display: "none"} : null
  }

  get nextStyle() {
    return !this.queue.length ? {display: "none"} : null
  }

  get likeStatus() {
    if (this.props.current && this.props.current.myReaction) {
      const {type} = this.props.current.myReaction
      if (type === "LIKE") return "active"
      if (type === "DISLIKE") return "inactive"
    }

    return "normal"
  }

  get dislikeStatus() {
    if (this.props.current && this.props.current.myReaction) {
      const {type} = this.props.current.myReaction
      if (type === "DISLIKE") return "active"
      if (type === "LIKE") return "inactive"
    }

    return "normal"
  }

  get mediaId() {
    return (this.props.current || {}).id
  }

  render() {
    return (
      <Container>
        <PlayerThumb src={this.thumbnail}>
          <Prev onClick={::this.prev} style={this.prevStyle} />
          <Play
            playing={this.props.playing}
            onClick={this.onPlay}
            color="white"
          />
          <Next onClick={::this.next} style={this.nextStyle} />
          <Dislike status={this.dislikeStatus} mediaId={this.mediaId} />
          <Like status={this.likeStatus} mediaId={this.mediaId} />
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
        <Title>
          {this.title}
        </Title>
        <Queue medias={this.props.queue} setCurrent={this.props.setCurrent} />
        <Div height={0} width={0}>
          <ReactPlayer
            {...this.soundcloudProps}
            key="soundcloud"
            ref={c => (this.soundcloudPlayer = c)}
          />
          <ReactPlayer
            {...this.youtubeProps}
            key="youtube"
            ref={c => (this.youtubePlayer = c)}
          />
        </Div>
      </Container>
    )
  }
}

const mapStateToProps = ({player, medias}) => {
  const list = medias[player.list]
  if (!list || !player.current)
    return {
      playing: false,
      current: null,
      cursor: null,
      queue: [],
      history: [],
    }
  else if (player.current) {
    const isCurrent = edge => edge.cursor === player.current
    const index = list.findIndex(isCurrent)
    return {
      playing: player.playing,
      current: list[index].node,
      cursor: list[index].cursor,
      queue: list.slice(index + 1, list.length),
      history: list.slice(0, index),
    }
  }
}

const mapDispatchToProps = dispatch => ({
  play: () => dispatch(play()),
  pause: () => dispatch(pause()),
  setCurrent: cursor => dispatch(setCurrent(cursor)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)
