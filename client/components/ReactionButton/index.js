import React from 'react'

import thumbUp from '../../assets/emojis/thumb_up.png'
import thumbDown from '../../assets/emojis/thumb_down.png'

import style from './style.styl'

const ReactionButton = ({status, type, ...props}) => {

  const emoji = type === 'dislike' ? thumbDown : thumbUp

  let emojiClassName = style.emojiNormal

  if (status === 'active')
    emojiClassName = style.emojiActive
  else if (status === 'inactive')
    emojiClassName = style.emojiInactive

  return (
    <div {...props}>
      <div className={style.wrapper}>
        <img src={emoji} className={emojiClassName} />
      </div>
    </div>
  )
}

export default ReactionButton
