import React from 'react'

import thumbUp from '../../assets/emojis/thumb_up.png'
import thumbDown from '../../assets/emojis/thumb_down.png'

import style from './style.styl'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const MUTATION = gql`
mutation addReaction($mediaId: String!, $type: ReactionType) {
  addReaction(media_id: $mediaId, type: $type) {
    media {
      id
      myReaction { type }
    }
    user {
      id
      likeCount
      dislikeCount
    }
  }
}
`

const withPerform = graphql(MUTATION, {
  props: ({mutate, ownProps: {mediaId, type}}) => ({
    perform: () => mutate({
      variables: {
        mediaId,
        type: type.toUpperCase()
      }
    })
  })
})

const ReactionButton = ({status, type, mediaId, perform, ...props}) => {

  const emoji = type === 'dislike' ? thumbDown : thumbUp

  let emojiClassName = style.emojiNormal

  if (status === 'active')
    emojiClassName = style.emojiActive
  else if (status === 'inactive')
    emojiClassName = style.emojiInactive

  return (
    <div {...props}>
      <div className={style.wrapper}>
        <img src={emoji} className={emojiClassName} onClick={perform} />
      </div>
    </div>
  )
}

export default withPerform(ReactionButton)
