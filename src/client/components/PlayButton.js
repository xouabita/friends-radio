import React from 'react'

import Play from 'react-icons/lib/io/play'
import Pause from 'react-icons/lib/io/pause'

import {css} from 'glamor'

const iconSize = '80%'
const circleStyle = css({
  borderRadius: '50%',
  width: '100%',
  height: '100%',
})
const iconStyle = css({
  width: iconSize,
  height: iconSize,
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
})

const PlayButton = ({color, playing, ...otherProps}) => (
  <div {...otherProps}>
    <div
      {...circleStyle}
      style={{border: `3px solid ${color}`}}
    >
      {
        playing ?
          <Pause {...iconStyle} style={{color}} />
        :
          <Play {...iconStyle} style={{color}} />
      }
    </div>
  </div>
)

export default PlayButton
