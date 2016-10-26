import React, { Component } from 'react'

import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap'

import style from './style.styl'

import Thumbnail from '../Thumbnail'

class MediaFormModal extends Component {
  constructor(...props) {
    super(...props)
    this.state = {
      url: this.props.url,
      title: this.props.title,
      artist: this.props.artist,
      thumbnail: this.props.thumbnail,
      description: this.props.description,
      duration: this.props.duration
    }
  }

  onDelete() {
    const sure = confirm('Are you sure you want to delete ?')
    if (sure) {
      this.props.onDelete(this.props.data.media.id)
      this.props.toggle()
    }
  }

  async onSubmit() {
    await this.props.onSubmit(this.state)
    this.props.toggle()
  }

  render() {
    const submitText = this.props.edit ?
      'Update song' : 'Add a song'
    const modalTitle = this.props.edit ?
      'Edit song' : 'Add a song'
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>{modalTitle}</ModalHeader>
        <ModalBody>
          <Thumbnail
            className={style.thumbnail}
            src={this.state.thumbnail}
            active={false}
          />
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
            <Label for="thumbnail">Thumbnail</Label>
            <Input
              name="thumbnail"
              placeholder='Thumbnail'
              value={this.state.thumbnail}
              onChange={e => this.setState({thumbnail: e.target.value})}
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
            children={submitText}
            block
            onClick={::this.onSubmit}
          />
          {
            this.props.edit ?
            <Button
              color='danger'
              children='Delete this song'
              block
              onClick={::this.onDelete}
            />
            : undefined
          }
        </ModalBody>
      </Modal>
    )
  }
}

export default MediaFormModal
