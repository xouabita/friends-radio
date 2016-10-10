import React, {Component, PropTypes as t} from 'react'
import { connect } from 'react-redux'

import ReactPlayer from 'react-player'
import PlayButton from '../PlayButton'

import style from './style.styl'

class Player extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playing: false,
      current: null
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (nextProps.current != this.props.current) {
      this.setState({
        current: nextProps.current,
        playing: true
      })
    }
  }

  render() {
    const thumbnail = this.state.current ?
      this.state.current.thumbnail
    :
      'http://www.pandora.com/img/no_album_art.png'

    const title = this.state.current ?
      this.state.current.title : ''

    const thumbnailStyle = {
      backgroundImage: `url(${thumbnail})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center'
    }

    return (
      <div className={style.container}>
        <div
          className={style.thumbnail}
          style={thumbnailStyle}
        >
          <div className={style.wrapper}>
            <PlayButton
              className={style.playButton}
              playing={this.state.playing}
              onClick={() => this.setState({playing: !this.state.playing})}
              color='white'
            />
          </div>
        </div>
        <p className={style.title}>{title}</p>
        {
          this.state.current ?
            <ReactPlayer
              url={this.state.current.url}
              hidden={true}
              playing={this.state.playing}
            />
          :
            undefined
        }
      </div>
    )
  }
}

const mediaType = t.shape({
  thumbnail: t.string,
  url: t.string.isRequired,
  title: t.string.isRequired
})

Player.propTypes = {
  history: t.arrayOf(mediaType),
  current: mediaType,
  queue: t.arrayOf(mediaType)
}

const mapStateToProps = ({player}) => ({
  ...player
})

export default connect(mapStateToProps)(Player)
