import React from 'react'

import MediaList, { withMedias } from '../components/MediaList'
import UserCard from '../components/UserCard'
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

const QUERY = gql`
query getUser($id: String!, $skip: Int!) {
  user(id: $id) {
    id
    name
    mediaCount
    likeCount
    dislikeCount
    medias(skip: $skip, limit: 50) {
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

const vars     = ({params}) => ({ id: params.user_id })
const uniqueId = ({params}) => `u(${params.user_id})`

export default withMedias(
  QUERY,
  uniqueId,
  [mediaInfoFragment],
  'user.medias',
  vars
)(User)
