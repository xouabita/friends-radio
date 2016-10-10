import React from 'react'

import style from './style.styl'

const Thumbnail = ({src, children, ...otherProps}) => {
  const thumbnailStyle = {
    backgroundImage: `url(${src})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center'
  }

  if (otherProps.style)
    Object.assign(thumbnailStyle, otherProps.style)

  return (
    <div {...otherProps} style={thumbnailStyle}>
      <div className={style.wrapper}>
        {children}
      </div>
    </div>
  )
}

export default Thumbnail
