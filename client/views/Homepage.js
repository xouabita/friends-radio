import React from 'react'

import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import gql from 'graphql-tag'

import { Container, Row, Col } from 'reactstrap'
import Media from '../components/Media'

import { start, play, pause } from '../actions/player.js'

const mediasQuery = gql`
  query getMedias {
    medias {
      id
      thumbnail
      title
      description
      url
    }
  }
`

const Homepage = ({data, play}) => (
  <div>
    {
      data.loading?
      <h2>Loading...</h2>
      :
      <div>
        {
          data.medias.map((media, i) =>
            <Media key={i} onPlay={() => play(i)} {...media} />
          )
        }
      </div>
    }
  </div>
)

const mapStateToProps = ({player}) => ({
  current: player.current,
  playing: player.playing
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  play: (index) => {
    const { medias } = ownProps.data
    if (ownProps.current && ownProps.current.id === medias[index].id)
      dispatch(ownProps.playing ? pause() : play())
    else {
      const history = medias.slice(0, index)
      const current = medias[index]
      const queue   = medias.slice(index + 1, medias.length)
      dispatch(start(history, current, queue))
    }
  }
})

const connected = connect(mapStateToProps, mapDispatchToProps)(Homepage)

export default graphql(mediasQuery)(connected)
