import React from 'react'

import style from './style.styl'
import avatarUrl from '../../utils/avatarUrl.js'

const UserCard = ({id, name, gender, mediaCount}) => (
  <div className={style.card}>
    <img src={avatarUrl(id)} />
    <div className={style.content}>
      <h1>{name}</h1>
      <div className={style.infos}>
        <div className={style.boxCount}>
          <div className={style.count}>{mediaCount}</div>
          <div className={style.label}>Posts</div>
        </div>
        <div className={style.boxCount}>
          <div className={style.count}>42</div>
          <div className={style.label}>Likes 👍</div>
        </div>
        <div className={style.boxCount}>
          <div className={style.count}>88</div>
          <div className={style.label}>Dislikes 👎</div>
        </div>
      </div>
    </div>
  </div>
)

export default UserCard
