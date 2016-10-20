import React, { Component } from 'react'
import {
  InputGroup,
  InputGroupButton,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Button,
  Label
} from 'reactstrap'
import ReactPlayer from 'react-player'
import Thumbnail from '../Thumbnail'

import style from './style.styl'

const infoFromYt = ({player}) => {
  const duration = player.getDuration()
  const { title, video_id } = player.getVideoData()
  const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`
  return {
    thumbnail,
    duration,
    title
  }
}

const getInfo = (player) => {
  if (player.constructor.name === 'YouTube')
    return infoFromYt(player)
}

class Uploader extends Component {

  constructor(...props) {
    super(...props)
    this.state = {
      modal: false,
      url: '',
      title: '',
      artist: '',
      thumbnail: '',
      description: '',
      duration: 0,
      ready: false,
      loading: false
    }
  }

  toggle = () => {
    this.setState({modal: !this.state.modal})
  }

  mediaReady = () => {
    const { title, thumbnail, duration } = getInfo(this.player.player)
    this.setState({ready: true, loading: false, title, thumbnail, duration})
  }

  mediaError = () => {
    this.setState({ready: false, loading: false})
  }

  inputChange = (e) => {
    this.setState({loading: true, url: e.target.value})
  }

  render() {
    return (
      <div>
        <div className={style.inputGroup}>
          <InputGroup>
            <Input
              value={this.state.url}
              onChange={this.inputChange}
            />
            <InputGroupButton
              color='primary'
              onClick={this.toggle}
              disabled={this.state.loading || !this.state.ready}
            >
              Add Song
            </InputGroupButton>
          </InputGroup>
        </div>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Add a song</ModalHeader>
          <ModalBody>
            <Thumbnail className={style.thumbnail} src={this.state.thumbnail} active={false} />
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                name="title"
                placeholder='Title'
                value={this.state.title}
                onChange={e => this.setState({title: e.target.value})}
              />
            </FormGroup>
            <FormGroup>
              <Label for="artist">Artist</Label>
              <Input
                name="artist"
                placeholder='Artist'
                value={this.state.artist}
                onChange={e => this.setState({artist: e.target.value})}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type='textarea'
                name="artist"
                placeholder='Description'
                value={this.state.description}
                onChange={e => this.setState({description: e.target.value})}
              />
            </FormGroup>
            <Button
              color='primary'
              children='Add a song'
              block
            />
          </ModalBody>
        </Modal>
        <ReactPlayer
          url={this.state.url}
          hidden={true}
          onReady={this.mediaReady}
          onError={this.mediaError}
          ref={player => this.player = player}
        />
      </div>
    )
  }
}

export default Uploader
