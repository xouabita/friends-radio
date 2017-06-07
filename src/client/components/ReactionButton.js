import React, {Component} from 'react'

import thumbUp from '../assets/emojis/heart.png'
import thumbDown from '../assets/emojis/poop.png'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import {css} from 'glamor'
import tada from '../styles/tada'

const sizeInactive = '40%'
const sizeNormal = '70%'
const sizeActive = '100%'

const emojiBaseStyle = css({
  position: 'absolute',
  height: 'auto',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  transition: 'all ease-in-out 1s',
  filter: 'drop-shadow(.5px .5px 1px rgba(0, 0, 0, .5))',
  ':hover': {
    cursor: 'pointer',
  },
})

const emojiNormalStyle = css({
  width: sizeNormal,
})

const emojiActiveStyle = css({
  width: sizeActive,
})

const emojiInactiveStyle = css({
  width: sizeInactive,
})

const animationStyle = css({
  animation: `${tada('translate(-50%, -50%)')} 1s`,
})

const wrapperStyle = css({
  width: '100%',
  height: '100%',
  position: 'relative',
})

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
    const {status, type, mediaId, perform, ...props} = this.props

    const emoji = type === 'dislike' ? thumbDown : thumbUp

    const styles = [emojiBaseStyle]
    switch (status) {
      case 'active':
        styles.push(emojiActiveStyle)
        break
      case 'inactive':
        styles.push(emojiInactiveStyle)
        break
      default:
        styles.push(emojiNormalStyle)
        break
    }

    if (this.state.animationStarted)
      styles.push(animationStyle)

    return (
      <div {...props}>
        <div {...wrapperStyle}>
          <img
            {...Object.assign({}, ...styles)}
            src={emoji}
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
