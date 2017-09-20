import React from "react"

import MediaList, {withMedias} from "../components/MediaList"
import UserCard from "../components/UserCard"
import getUserMedias from "../graphql/queries/getUserMedias.graphql"
import getUserLikes from "../graphql/queries/getUserLikes.graphql"
import getUserDislikes from "../graphql/queries/getUserDislikes.graphql"

const User = ({data, loadMore, uniqueId, params}) => {
  const mediaListData = {
    loading: data.loading,
    medias: data.loading ? null : data.user.medias,
  }

  return (
    <div>
      {!data.loading
        ? <UserCard
            id={params.user_id}
            name={data.user.name}
            mediaCount={data.user.mediaCount.value}
            likeCount={data.user.likeCount.value}
            dislikeCount={data.user.dislikeCount.value}
          />
        : undefined}
      <MediaList data={mediaListData} uniqueId={uniqueId} loadMore={loadMore} />
    </div>
  )
}

const UserWithMedias = ({match: {params}}) => {
  // fix because undefined => "undefined"
  const source =
    params.source === "likes" || params.source === "dislikes"
      ? params.source
      : "medias"
  const query =
    source === "medias"
      ? getUserMedias
      : source === "likes" ? getUserLikes : getUserDislikes
  const WithMedias = withMedias(
    query,
    `u(${params.user_id}).${source}`,
    "user.medias",
    () => ({id: params.user_id}),
  )(props => <User params={params} {...props} />)

  return <WithMedias />
}

export default UserWithMedias
