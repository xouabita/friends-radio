import React, {Component} from "react"

import {InputGroup, Input, InputGroupButton} from "reactstrap"
import ReactPlayer from "react-player"

import gql from "graphql-tag"
import {graphql} from "react-apollo"
import {Div} from "glamorous"

import MediaFormModal from "./MediaFormModal"

const infoFromYt = ({player}) => {
  const duration = player.getDuration()
  const {title, video_id} = player.getVideoData()
  const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`
  return {
    thumbnail,
    duration,
    title,
  }
}

const infoFromSc = ({player}) =>
  new Promise(resolve => {
    player.getCurrentSound(info =>
      resolve({
        thumbnail: info.artwork_url.replace("-large", "-t500x500"),
        duration: parseInt(info.duration / 1000, 10),
        title: info.title,
        artist: info.user.username,
      }),
    )
  })

const getInfo = async (player, url) => {
  window.player = player
  if (player.player.getVideoData) return infoFromYt(player)
  else if (player.player.getCurrentSound) return infoFromSc(player)
}

const initialState = {
  modal: false,
  url: "",
  title: "",
  artist: "",
  thumbnail: "",
  description: "",
  duration: 0,
  ready: false,
  loading: false,
}

const ADD_MEDIA_MUTATION = gql`
  mutation addMedia($media: AddMediaInput!) {
    addMedia(media: $media) {
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

const withAddMedia = graphql(ADD_MEDIA_MUTATION, {
  props: ({mutate}) => ({
    addMedia: ({url, title, duration, artist, description, thumbnail}) =>
      mutate({
        variables: {
          media: {
            url,
            title,
            duration,
            artist,
            description,
            thumbnail,
          },
        },
        refetchQueries: [`getUserMedias`, `getHome`],
      }),
  }),
})

class Uploader extends Component {
  constructor(...props) {
    super(...props)
    this.state = initialState
  }

  toggle = () => {
    this.setState({modal: !this.state.modal})
  }

  async mediaReady() {
    const {title, thumbnail, duration, artist} = await getInfo(
      this.player.player,
      this.state.url,
    )
    this.setState({
      ready: true,
      loading: false,
      title,
      thumbnail,
      duration,
      artist,
    })
  }

  mediaError = () => {
    this.setState({ready: false, loading: false})
  }

  inputChange = e => {
    this.setState({loading: true, url: e.target.value})
  }

  submit = media => {
    this.props.addMedia(media).then(() => this.setState(initialState))
  }

  render() {
    return (
      <div>
        <Div width="calc(100% - 100px)" margin="20px auto">
          <InputGroup>
            <Input value={this.state.url} onChange={this.inputChange} />
            <InputGroupButton
              color="primary"
              onClick={this.toggle}
              disabled={this.state.loading || !this.state.ready}
            >
              Add Song
            </InputGroupButton>
          </InputGroup>
        </Div>
        {!this.state.loading && this.state.ready
          ? <MediaFormModal
              isOpen={this.state.modal}
              toggle={this.toggle}
              onSubmit={this.submit}
              url={this.state.url}
              title={this.state.title}
              artist={this.state.artist}
              thumbnail={this.state.thumbnail}
              description={this.state.description}
              duration={this.state.duration}
            />
          : undefined}
        <ReactPlayer
          url={this.state.url}
          hidden={true}
          onReady={this.mediaReady.bind(this)}
          onError={this.mediaError}
          ref={player => (this.player = player)}
        />
      </div>
    )
  }
}

export default withAddMedia(Uploader)
