import React, { Component, PropTypes as t } from 'react'

import { Button } from 'reactstrap'
import Media from '../Media'

import { updateList } from '../../actions/medias.js'
import { start, play, pause } from '../../actions/player.js'

import { graphql } from 'react-apollo'
import { connect } from 'react-redux'

class MediaList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data, play, loadMore } = this.props
    return (
      <div>
        {
          !data || data.loading ?
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
  }
}

const mediaType = t.shape({
  id: t.string.isRequired,
  title: t.string.isRequired,
  url: t.string.isRequired,
  thumbnail: t.string,
  artist: t.string,
  description: t.string,
})

const dataType = t.shape({
  loading: t.bool.isRequired,
  medias: t.arrayOf(mediaType),
  fetchMore: t.func.isRequired
})

MediaList.propTypes = {
  data: dataType,
  uniqueId: t.string.isRequired,
  loadMore: t.func,
  play: t.func.isRequired,
}

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

export function withMedias(graphqlQuery, uniqueId) {
  return graphql(graphqlQuery, {
    options: () => ({
      variables: { skip: 0 },
      forceFetch: true
    }),
    props: ({data}) => ({
      data,
      uniqueId,
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
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaList)
