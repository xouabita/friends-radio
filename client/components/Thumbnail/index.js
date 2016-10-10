import React from 'react'

import style from './style.styl'

const Thumbnail = ({src, children, active, ...otherProps}) => {
  const thumbnailStyle = {
    backgroundImage: `url(${src})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center'
  }

  let activeStyle = undefined
  if (active === true)
    activeStyle = {opacity: 1}
  else if (active === false)
    activeStyle = {opacity: 0}

  if (otherProps.style)
    Object.assign(thumbnailStyle, otherProps.style)

  return (
    <div {...otherProps} style={thumbnailStyle}>
      <div className={style.wrapper} style={activeStyle}>
        {children}
      </div>
    </div>
  )
}

export default Thumbnail
