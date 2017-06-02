import React from 'react'

import avatarUrl from '../utils/avatarUrl.js'

import {Link} from 'react-router-dom'
import glamorous from 'glamorous'

const size = 240
const border = 2

const Card = glamorous.div({
  height: size,
  width: 'calc(100% - 100px)',
  background: '#fff',
  margin: '20px auto',
  border: `solid ${border}px rgba(0, 0, 0, .05)`,
  position: 'relative',
  '& img': {
    height: .84 * size,
    margin: .08 * size,
  },
  '& h1': {
    marginTop: 20,
  },
})

const Content = glamorous.div({
  position: 'absolute',
  top: .1 * size,
  height: `calc(100% - ${.2 * size}px)`,
  width: `calc(100% - ${.1 * size + size}px)`,
  left: size,
  textAlign: 'center',
})

const Infos = glamorous.div({
  width: '100%',
  position: 'absolute',
  padding: 20,
  bottom: 0,
})

const BoxCount = glamorous(Link)({
  textAlign: 'center',
  width: '33%',
  display: 'inline-block',
  color: 'inherit',
  ':hover': { textDecoration: 'none' },
})

const Count = glamorous.div({fontWeight: 'bold'})

const UserCard = ({id, name, gender, mediaCount, likeCount, dislikeCount}) => (
  <Card>
    <img src={avatarUrl(id)} />
    <Content>
      <h1>{name}</h1>
      <Infos>
        <BoxCount to={`/u/${id}`}>
          <Count>{mediaCount}</Count>
          <div>Posts</div>
        </BoxCount>
        <BoxCount to={`/u/${id}/likes`}>
          <Count>{likeCount}</Count>
          <div>Likes 💖</div>
        </BoxCount>
        <BoxCount to={`/u/${id}/dislikes`}>
          <Count>{dislikeCount}</Count>
          <div>Dislikes 💩</div>
        </BoxCount>
      </Infos>
    </Content>
  </Card>
)

export default UserCard
