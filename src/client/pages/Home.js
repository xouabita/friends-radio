import React from "react"
import {graphql} from "react-apollo"
import gql from "graphql-tag"

import Uploader from "../components/Uploader"
import MediaList, {withMedias} from "../components/MediaList"
import getMe from "../queries/getMe.graphql"

const MEDIAS_QUERY = gql`
  query getMedias($skip: Int!) {
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
      myReaction {
        type
      }
    }
  }
`

const MediaListWithMedias = withMedias(MEDIAS_QUERY, "homepage", [])(MediaList)

const Homepage = ({data}) =>
  <div>
    {!data.loading && data.me && <Uploader />}
    <MediaListWithMedias />
  </div>

export default graphql(getMe)(Homepage)
