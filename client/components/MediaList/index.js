import React, { Component, PropTypes as t } from 'react'

import { Button } from 'reactstrap'
import MediaCard from '../MediaCard'

import { updateList } from '../../actions/medias.js'
import { start, play, pause } from '../../actions/player.js'

import { graphql } from 'react-apollo'
import { connect } from 'react-redux'

import _get from 'lodash.get'
import _set from 'lodash.set'

import style from './style.styl'

class MediaList extends Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(props) {

    const isLoading = (props.data.loading || this.props.data.loading)

    if (!props.data.loading && props.data.medias !== this.props.data.medias) {
      props.updateList(props.data.medias)
    }

    if (!isLoading && props.data.medias.length - props.current < 10)
      this.props.loadMore()
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
                <MediaCard
                  key={i}
                  list={this.props.uniqueId}

                  index={i}
                  onPlay={() => play(this.props.player, i)}
                  {...media}
                />
              )
            }
          </div>
        }
        <Button
          outline
          onClick={loadMore}
          className={style.loadMore}
        >
          Load More...
        </Button>
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
})

MediaList.propTypes = {
  data: dataType,
  uniqueId: t.string.isRequired,
  loadMore: t.func,
  play: t.func.isRequired,
}

const mapStateToProps = ({player}) => ({
  current: player.current,
  playing: player.playing,
  player
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  play: (player, index) => {
    if (player.list === ownProps.uniqueId && index === player.current)
      player.playing ? dispatch(pause()) : dispatch(play())
    else
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

export function withMedias(
  graphqlQuery,
  uniqueId,
  fragments,
  mediasPath = 'medias',
  vars = () => {}
) {
  return graphql(graphqlQuery, {
    options: (props) => ({
      variables: { ...vars(props), skip: 0 },
      forceFetch: true,
      fragments
    }),
    props: ({data, ownProps: props}) => ({
      data,
      uniqueId: typeof uniqueId === 'string' ? uniqueId : uniqueId(props),
      loadMore: () => data.fetchMore({
        variables: { skip: _get(data, mediasPath).length },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult.data) return prev
          let newData = Object.assign({}, prev)
          _set(newData, mediasPath, [
            ..._get(prev, mediasPath),
            ..._get(fetchMoreResult.data, mediasPath)
          ])
          return newData
        }
      })
    })
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaList)
