import React from 'react'

import MediaList, { withMedias } from '../components/MediaList'
import UserCard from '../components/UserCard'
import gql from 'graphql-tag'

const QUERY = gql`
query getUser($id: String!, $skip: Int!) {
  user(id: $id) {
    name
    gender
    mediaCount
    medias(skip: $skip, limit: 50) {
      id
      title
      url
      thumbnail
      artist
      description
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

export default withMedias(QUERY, uniqueId, 'user.medias', vars)(User)
