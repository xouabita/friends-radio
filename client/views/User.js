import React from 'react'

import MediaList, { withMedias } from '../components/MediaList'
import gql from 'graphql-tag'

const QUERY = gql`
query getUser($id: String!, $skip: Int!) {
  user(id: $id) {
    name
    gender
    medias(skip: $skip, limit: 50) {
      id
      title
      url
      thumbnail
      artist
      description
      posted_by {
        id
        name
      }
    }
  }
}
`

const User = ({data, loadMore, uniqueId}) => {

  const mediaListData = {
    loading: data.loading,
    medias: data.loading ? null : data.user.medias
  }

  return (
    <MediaList data={mediaListData} uniqueId={uniqueId} loadMore={loadMore} />
  )
}

const vars     = ({params}) => ({ id: params.user_id })
const uniqueId = ({params}) => `u(${params.user_id})`

export default withMedias(QUERY, uniqueId, 'user.medias', vars)(User)
