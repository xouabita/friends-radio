import React from 'react'
import style from './style.styl'

import { Row } from 'reactstrap'
import Truncate from 'react-truncate'

const Ô = ({children}) =>
  <Truncate ellipsis='…'>
    {children}
  </Truncate>

const Media = (media) => (
  <div className={style.card}>
    <div className={style.thumbnail}>
      <img src={media.thumbnail} />
    </div>
    <div className={style.content}>
      <h5><Ô>{media.title}</Ô></h5>
      <p><Ô>{media.description}</Ô></p>
    </div>
  </div>
)

export default Media
