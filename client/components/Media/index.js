import React from 'react'
import style from './style.styl'

import { Row } from 'reactstrap'

const Media = (media) => (
  <div className={style.card}>
    <div className={style.thumbnail}>
      <img src={media.thumbnail} />
    </div>
    <div className={style.content}>
      <h5>{media.title}</h5>
      <p>{media.description}</p>
    </div>
  </div>
)

export default Media
