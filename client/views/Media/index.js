import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import style from './style.styl'

import { Media, Row } from 'reactstrap'
import Link from 'react-router/Link'

import Facebook, { Comments } from 'react-facebook'

import { Button } from 'reactstrap'

import { fbOptions } from '../../../config.js'
import MediaFormModal from '../../components/MediaFormModal'

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

class MediaForm extends Component {
  constructor(...props) {
    super(...props)
    this.state = {
      title: this.props.title,
      url: this.props.url,
      thumbnail: this.props.thumbnail,
      artist: this.props.artist,
      description: this.props.description
    }
  }

  render() {
    return (
      <Media>
        <Media left>
          <Media
            className={style.thumbail}
            objet src={media.thumbnail}
          />
        </Media>
      </Media>
    )
  }
}

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
      <div className={style.card}>
        {
          me.id === media.posted_by.id ?
            <MediaFormModal
              isOpen={this.state.modalOpen}
              toggle={this.toggleModal}
              {...media}
            />
          : undefined
        }
        <Media>
          <Media left href={media.url} target='_blank'>
            <Media
              className={style.thumbnail}
              object src={media.thumbnail}
            />
          </Media>
          <Media body className={style.body}>
            <div>
              <h5 className={style.artist}>
                {
                  media.artist
                  ? media.artist
                  : (<i>Unknown</i>)
                }
              </h5>
              {
                me.id === media.posted_by.id ?
                  <Button
                    children='Edit'
                    size='sm'
                    color='primary'
                    outline
                    className={style.editButton}
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
        <Facebook appID={fbOptions.clientID}>
          <Comments
            width='100%'
            href={`${location.host}/m/${this.props.params.id}`}
          />
        </Facebook>
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
