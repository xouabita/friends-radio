import React from 'react'

import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import gql from 'graphql-tag'

import { Container, Row, Col } from 'reactstrap'
import Media from '../components/Media'

import { Button } from 'reactstrap'

import { start, play, pause } from '../actions/player.js'

const MEDIAS_QUERY = gql`
  query getMedias($skip: Int!) {
    medias(skip: $skip, limit: 50) {
      id
      thumbnail
      artist
      title
      description
      url
    }
  }
`

const withMedias = graphql(MEDIAS_QUERY, {
  options: () => ({
    variables: { skip: 0 },
    forceFetch: true
  }),
  props: ({data}) => ({
    data,
    loadMore: () => data.fetchMore({
      variables: { skip: data.medias.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult.data) return prev
        return {
          ...prev,
          medias: [...prev.medias, ...fetchMoreResult.data.medias]
        }
      }
    })
  })
})

const Homepage = ({data, play, loadMore}) => (
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
    <Button onClick={loadMore}>Load More...</Button>
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

export default withMedias(connected)
