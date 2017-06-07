import React, {Component} from 'react'

import { Button } from 'reactstrap'
import MediaCard from './MediaCard'

import { updateList } from '../actions/medias.js'
import { start, play, pause } from '../actions/player.js'

import { graphql } from 'react-apollo'
import { connect } from 'react-redux'

import _get from 'lodash.get'
import _set from 'lodash.set'

import {css} from 'glamor'
import mainColor from '../styles/mainColor'

const loadMoreStyle = css({
  margin: '20px auto',
  display: 'block !important',
  transition: 'all ease-in-out 300ms',
  color: `${mainColor} !important`,
  borderColor: `${mainColor} !important`,
  ':hover, :focus': {
    background: `${mainColor} !important`,
    color: `white !important`,
    outline: `none`,
  }
})

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
          {...loadMoreStyle}
          outline
          onClick={loadMore}
        >
          Load More...
        </Button>
      </div>
    )
  }
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
      fragments
    }),
    props: ({data, ownProps: props}) => ({
      data,
      uniqueId: typeof uniqueId === 'string' ? uniqueId : uniqueId(props),
      loadMore: () => data.fetchMore({
        variables: { skip: _get(data, mediasPath).length },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          let newData = Object.assign({}, prev)
          _set(newData, mediasPath, [
            ..._get(prev, mediasPath),
            ..._get(fetchMoreResult, mediasPath)
          ])
          return newData
        }
      })
    })
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaList)
