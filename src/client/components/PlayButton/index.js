import React from 'react'
import style from './style.styl'

import Play from 'react-icons/lib/io/play'
import Pause from 'react-icons/lib/io/pause'

const PlayButton = ({color, playing, ...otherProps}) => (
  <div {...otherProps}>
    <div
      className={style.circle}
      style={{border: `3px solid ${color}`}}
    >
      {
        playing ?
          <Pause className={style.icon} style={{color}} />
        :
          <Play className={style.icon} style={{color}} />
      }
    </div>
  </div>
)

export default PlayButton
