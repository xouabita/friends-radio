import React, {Component} from 'react'

import thumbUp from '../../assets/emojis/heart.png'
import thumbDown from '../../assets/emojis/poop.png'

import style from './style.styl'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const ADD_REACTION_MUTATION = gql`
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

const DELETE_REACTION_MUTATION = gql`
mutation deleteReaction($mediaId: String!, $type: ReactionType!) {
  deleteReaction(media_id: $mediaId, type: $type) {
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

const withPerform = (mutation) => graphql(mutation, {
  props: ({mutate, ownProps: {mediaId, type}}) => ({
    perform: () => mutate({
      variables: {
        mediaId,
        type: type.toUpperCase()
      },
      refetchQueries: [
        'getUserWith_likes',
        'getUserWith_dislikes'
      ]
    })
  })
})

class ReactionButton extends Component {

  constructor(...props) {
    super(...props)
    this.state = {
      animationStarted: null,
      justClicked: false
    }
  }

  onClick = () => {
    this.setState({justClicked: false})
    this.props.perform()
  }

  onMouseEnter = () => {
    if (!this.state.animationStarted) {
      setTimeout(() => this.setState({animationStarted: false}), 1000)
      this.setState({animationStarted: true})
    }
  }

  render() {
    const {status, type, mediaId, ...props} = this.props

    const emoji = type === 'dislike' ? thumbDown : thumbUp

    let emojiClassName = style.emojiNormal

    if (status === 'active')
      emojiClassName = style.emojiActive
    else if (status === 'inactive')
      emojiClassName = style.emojiInactive

    if (this.state.animationStarted)
      emojiClassName += ' ' + style.animationStarted
    if (this.state.justClicked)
      emojiClassName += ' ' + style.justClicked

    return (
      <div {...props}>
        <div className={style.wrapper}>
          <img
            src={emoji}
            className={emojiClassName}
            onClick={this.onClick}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={() => this.setState({justClicked: false})}
          />
        </div>
      </div>
    )
  }
}

const ReactionButtonWithPerform = (props) => {
  const WithPerformWrapped = props.status === 'active'
    ? withPerform(DELETE_REACTION_MUTATION)(ReactionButton)
    : withPerform(ADD_REACTION_MUTATION)(ReactionButton)
  return <WithPerformWrapped {...props} />
}

export default ReactionButtonWithPerform
