import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import style from './style.styl'

import { Media, Row } from 'reactstrap'
import Link from 'react-router/Link'

const GET_MEDIA_QUERY = gql`
  query getMedia($id: String!) {
    media(id: $id) {
      id
      title
      url
      thumbnail
      artist
      description
      myReaction {
        type
      }
      posted_by {
        id
        name
      }
    }
  }
`

class MediaView extends Component {
  render() {
    const { data } = this.props
    if (data.loading)
      return (<h3>Loading...</h3>)

    const {media} = data

    return(
      <div className={style.card}>
        <Media>
          <Media left href={media.url} target='_blank'>
            <Media
              className={style.thumbnail}
              object src={media.thumbnail}
            />
          </Media>
          <Media body className={style.body}>
            <h5>
              {
                media.artist
                  ? media.artist
                  : (<i>Unknown</i>)
              }
            </h5>
            <h4>{media.title}</h4>
            <p>{media.description}</p>
            <Link to={`/u/${media.posted_by.id}`}>
              Posted by <i>{media.posted_by.name}</i>
            </Link>
          </Media>
        </Media>
      </div>
    )
  }
}

const withMedia = graphql(GET_MEDIA_QUERY, {
  options: ({params}) => ({
    variables: {
      id: params.id
    }
  })
})

export default withMedia(MediaView)
