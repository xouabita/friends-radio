import React from 'react'

import MediaList, { withMedias } from '../../components/MediaList'
import UserCard from '../../components/UserCard'
import gql from 'graphql-tag'

import { createFragment } from 'apollo-client'

const mediaInfoFragment = createFragment(gql`
fragment MediaInfo on Media {
  id
  title
  url
  thumbnail
  artist
  description
  myReaction {
    type
  }
}
`)

const queryUserWith = (source) => gql`
query getUserWith_${source}($id: String!, $skip: Int!) {
  user(id: $id) {
    id
    name
    mediaCount
    likeCount
    dislikeCount
    medias: ${source}(skip: $skip, limit: 50) {
      ... MediaInfo
    }
  }
}
`

const User = ({data, loadMore, uniqueId, params}) => {

  const mediaListData = {
    loading: data.loading,
    medias: data.loading ? null : data.user.medias
  }

  return (
    <div>
      {
        !data.loading ?
          <UserCard
            id={params.user_id}
            name={data.user.name}
            mediaCount={data.user.mediaCount}
            likeCount={data.user.likeCount}
            dislikeCount={data.user.dislikeCount}
          />
        :
          undefined
      }
      <MediaList
        data={mediaListData}
        uniqueId={uniqueId}
        loadMore={loadMore}
      />
    </div>
  )
}

const UserWithMedias = ({params}) => {
  // fix because undefined => "undefined"
  const source = params.source === 'likes' || params.source == 'dislikes'
    ? params.source
    : 'medias'
  const WithMedias = withMedias(
    queryUserWith(source),
    () => `u(${params.user_id}).${source}`,
    [mediaInfoFragment],
    'user.medias',
    () => ({ id: params.user_id })
  )((props) => <User params={params} {...props} />)

  return <WithMedias />
}

export default UserWithMedias
