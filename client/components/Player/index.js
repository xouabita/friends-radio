import React, {Component, PropTypes as t} from 'react'
import { connect } from 'react-redux'

import ReactPlayer from 'react-player'

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
    return (
      <div className={style.container}>
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
  url: t.string.isRequired
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
