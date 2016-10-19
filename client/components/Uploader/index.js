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
  Label
} from 'reactstrap'
import ReactPlayer from 'react-player'

import style from './style.styl'

class Uploader extends Component {

  constructor(...props) {
    super(...props)
    this.state = {
      modal: false,
      url: '',
      title: '',
      artist: '',
      description: '',
      ready: false,
      loading: false
    }
  }

  toggle = () => {
    this.setState({modal: !this.state.modal})
  }

  mediaReady = () => {
    const { title } = this.player.player.player.getVideoData()
    console.log(title)
    this.setState({ready: true, loading: false, title})
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
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                name="title"
                placeholder='Title'
                value={this.state.title}
                onChange={e => this.setState({title: e.target.value})}
              />
            </FormGroup>
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
