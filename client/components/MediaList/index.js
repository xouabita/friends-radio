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

  componentWillReceiveProps(props) {
    if (!props.data.loading) {
      props.updateList(props.data.medias)
    }
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
    dispatch({ type: 'START', payload: {
      current: index,
      list: ownProps.uniqueId,
      play: true
    }})
  },
  updateList: (list) => {
    dispatch(updateList(ownProps.uniqueId, list))
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
