import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Media, Row } from 'reactstrap'
import {Link} from 'react-router-dom'
import {
  Div,
  H5,
} from 'glamorous'
import {css} from 'glamor'

import Facebook, { Comments } from 'react-facebook'

import { Button } from 'reactstrap'

import { fbOptions } from '../../config.js'
import MediaFormModal from '../components/MediaFormModal'


const style = {}
const styles = {
  thumbnail: css({
    width: 250,
    height: 250,
    marginRight: 20,
  }),
  inlineBlock: css({
    display: 'inline-block',
  }),
  floatRight: css({
    float: 'right',
  }),
}

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
    },
    me {
      id
    }
  }
`

const EDIT_MEDIA_MUTATION = gql`
  mutation editMedia($id: String!, $media: EditMediaInput!) {
    media: editMedia(media_id: $id, media: $media) {
      id
      title
      url
      thumbnail
      artist
      description
    }
  }
`

const withEditMedia = graphql(EDIT_MEDIA_MUTATION, {
  props: ({mutate, ownProps}) => ({
    onSubmit: (media) => mutate({
      variables: {
        id: ownProps.id,
        media
      }
    })
  })
})

const MediaFormModalEditable = withEditMedia(MediaFormModal)

class MediaView extends Component {
  constructor(...props) {
    super(...props)
    this.state = {
      modalOpen: false
    }
  }

  toggleModal = () => this.setState({modalOpen: !this.state.modalOpen})

  render() {
    const { data } = this.props
    if (data.loading)
      return (<h3>Loading...</h3>)

    const {media, me} = data

    return(
      <Div
        width="calc(100% - 100px)"
        background="#fff"
        margin="20px auto"
        border="solid 2px rgba(0, 0, 0, .05)"
        padding={10}
      >
        {
          me && me.id === media.posted_by.id ?
            <MediaFormModalEditable
              edit
              isOpen={this.state.modalOpen}
              toggle={this.toggleModal}
              {...media}
            />
          : undefined
        }
        <Media>
          <Media left href={media.url} target='_blank'>
            <Media
              {...styles.thumbnail}
              object src={media.thumbnail}
            />
          </Media>
          <Media body className={style.body}>
            <div>
              <h5 {...styles.inlineBlock}>
                {
                  media.artist
                  ? media.artist
                  : (<i>Unknown</i>)
                }
              </h5>
              {
                me.id === media.posted_by.id ?
                  <Button
                    {...styles.inlineBlock}
                    {...styles.floatRight}
                    children='Edit'
                    size='sm'
                    color='primary'
                    outline
                    onClick={this.toggleModal}
                  />
                : undefined
              }
            </div>
            <h4>{media.title}</h4>
            <p>{media.description}</p>
            <Link to={`/u/${media.posted_by.id}`}>
              Posted by <i>{media.posted_by.name}</i>
            </Link>
          </Media>
        </Media>
        <Facebook appId={fbOptions.clientID}>
          <Comments
            width='100%'
            href={`${location.host}/m/${this.props.match.params.id}`}
          />
        </Facebook>
      </Div>
    )
  }
}

const withMedia = graphql(GET_MEDIA_QUERY, {
  options: ({match: {params}}) => ({
    variables: {
      id: params.id,
    }
  })
})

export default withMedia(MediaView)
