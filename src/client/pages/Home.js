import React from "react"
import {graphql} from "react-apollo"

import Uploader from "../components/Uploader"
import MediaList, {withMedias} from "../components/MediaList"
import getMe from "../graphql/queries/getMe.graphql"
import getHome from "../graphql/queries/getHome.graphql"

const MediaListWithMedias = withMedias(getHome, "homepage")(MediaList)

const Homepage = ({data}) =>
  <div>
    {!data.loading && data.me && <Uploader />}
    <MediaListWithMedias />
  </div>

export default graphql(getMe)(Homepage)
