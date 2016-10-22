import React from 'react'

import style from './style.styl'
import avatarUrl from '../../utils/avatarUrl.js'

import Link from 'react-router/Link'

const UserCard = ({id, name, gender, mediaCount, likeCount, dislikeCount}) => (
  <div className={style.card}>
    <img src={avatarUrl(id)} />
    <div className={style.content}>
      <h1>{name}</h1>
      <div className={style.infos}>
        <Link
          className={style.boxCount}
          activeClassName={style.active}
          to={`/u/${id}`}
        >
          <div className={style.count}>{mediaCount}</div>
          <div className={style.label}>Posts</div>
        </Link>
        <Link
          className={style.boxCount}
          activeClassName={style.active}
          to={`/u/${id}/likes`}
        >
          <div className={style.count}>{likeCount}</div>
          <div className={style.label}>Likes 💖</div>
        </Link>
        <Link
          className={style.boxCount}
          activeClassName={style.active}
          to={`/u/${id}/dislikes`}
        >
          <div className={style.count}>{dislikeCount}</div>
          <div className={style.label}>Dislikes 💩</div>
        </Link>
      </div>
    </div>
  </div>
)

export default UserCard
