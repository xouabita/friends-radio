import React from 'react'
import { connect } from 'react-redux'
import { play, pause } from '../actions/player.js'

import { Row } from 'reactstrap'
import Thumbnail from './Thumbnail'
import PlayButton from './PlayButton'

import ReactionButton from './ReactionButton'

import {Link} from 'react-router-dom'

import {
  Div,
  Span,
  P,
} from 'glamorous'
import {css} from 'glamor'

const size = 120
const border = 2
const thumbSize = size - border * 2
const reactionSize = size / 2

const styles = {
  thumbnail: css({
    width: thumbSize,
    height: thumbSize,
    display: 'inline-block',
    verticalAlign: 'top',
  }),
  playButton: css({
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    height: '60%',
    ' :hover': {
      cursor: 'pointer',
    },
  }),
  title: css({
    color: '#373a3c',
    transition: 'all ease-in-out 300ms',
    textDecoration: 'none',
  }),
  text: css({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),
  reactions: css({
    display: 'inline-block',
    width: reactionSize,
    height: size,
    transition: 'all ease-in-out 400ms',
    position: 'relative',
  }),
  reaction: css({
    width: reactionSize * .8,
    height: reactionSize * .8,
    position: 'absolute',
    display: 'block',
  }),
  reactionLike: css({
    top: '10%',
  }),
  reactionDislike: css({
    bottom: '10%',
    transform: 'rotateY(180deg)',
  })
}

const MediaCard = (media) => {

  const likeStatus = media.myReaction
    ? media.myReaction.type === 'LIKE' ? 'active' : 'inactive'
    : 'normal'
  const dislikeStatus = media.myReaction
    ? media.myReaction.type === 'DISLIKE' ? 'active' : 'inactive'
    : 'normal'

  return (
    <Div
      height={size}
      width="calc(100% - 100px)"
      background="#fff"
      margin="20px auto"
      border={`solid ${border}px rgba(0, 0, 0, .05)`}
      position="relative"
    >
      <Thumbnail
        {...styles.thumbnail}
        src={media.thumbnail}
        active={media.playing ? true : undefined}
      >
        <PlayButton
          {...styles.playButton}
          playing={media.playing} color='white'
          onClick={media.onPlay}
        />
      </Thumbnail>
      <Div
        display='inline-block'
        verticalAlign='top'
        margin='10px 20px'
        width={`calc(100% - ${size + reactionSize}px - 40px)`}
      >
        <Link to={`/m/${media.id}`} {...styles.title}>
          <h5 {...styles.text}>
            {(media.artist ? `${media.artist} - ` : '') + media.title}
          </h5>
        </Link>
        <p {...styles.text}>{media.description}</p>
        {
          media.posted_by ?
          <Link to={`/u/${media.posted_by.id}`}>
            <P
              fontSize={13}
              position='absolute'
              bottom={0}
            >
              Posted by <Span fontWeight='bold'>{media.posted_by.name}</Span>
            </P>
          </Link>
          :
          undefined
        }
      </Div>
      <div {...styles.reactions}>
        <ReactionButton
          {...styles.reaction}
          {...styles.reactionLike}
          type='like'
          status={likeStatus}
          mediaId={media.id}
        />
        <ReactionButton
          {...styles.reaction}
          {...styles.reactionDislike}
          type='dislike'
          status={dislikeStatus}
          mediaId={media.id}
        />
      </div>
    </Div>
  )
}

const mapStateToProps = ({player}, ownProps) => ({
  playing: player.playing && player.list === ownProps.list &&
    ownProps.index === player.current
})

export default connect(mapStateToProps)(MediaCard)
