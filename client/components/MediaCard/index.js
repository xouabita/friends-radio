import React from 'react'
import style from './style.styl'
import { connect } from 'react-redux'
import { play, pause } from '../../actions/player.js'

import { Row } from 'reactstrap'
import Thumbnail from '../Thumbnail'
import PlayButton from '../PlayButton'

import ReactionButton from '../ReactionButton'

import Link from 'react-router/Link'

const MediaCard = (media) => {

  const likeStatus = media.myReaction
    ? media.myReaction.type === 'LIKE' ? 'active' : 'inactive'
    : 'normal'
  const dislikeStatus = media.myReaction
    ? media.myReaction.type === 'DISLIKE' ? 'active' : 'inactive'
    : 'normal'

  return (
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
        {
          media.posted_by ?
          <Link to={`/u/${media.posted_by.id}`}>
            <p className={style.postedBy}>
              Posted by <span>{media.posted_by.name}</span>
            </p>
          </Link>
          :
          undefined
        }
      </div>
      <div className={style.reactions}>
        <ReactionButton
          type='like'
          className={style.reactionLike}
          status={likeStatus}
          mediaId={media.id}
        />
        <ReactionButton
          type='dislike'
          className={style.reactionDislike}
          status={dislikeStatus}
          mediaId={media.id}
        />
      </div>
    </div>
  )
}

const mapStateToProps = ({player}, ownProps) => ({
  playing: player.playing && player.list === ownProps.list &&
    ownProps.index === player.current
})

export default connect(mapStateToProps)(MediaCard)
