import React, {Component} from "react"

import {Button} from "reactstrap"
import {P} from "glamorous"
import MediaCard from "./MediaCard"

import {updateList} from "../actions/medias.js"
import {play, pause, start} from "../actions/player.js"

import {graphql} from "react-apollo"
import {connect} from "react-redux"

import _get from "lodash.get"
import _set from "lodash.set"

import {css} from "glamor"
import mainColor from "../styles/mainColor"

const loadMoreStyle = css({
  margin: "20px auto",
  display: "block !important",
  transition: "all ease-in-out 300ms",
  color: `${mainColor} !important`,
  borderColor: `${mainColor} !important`,
  ":hover, :focus": {
    background: `${mainColor} !important`,
    color: `white !important`,
    outline: `none`,
  },
})

class MediaList extends Component {
  componentWillReceiveProps(props) {
    const isLoading = props.data.loading || this.props.data.loading

    if (!props.data.loading && props.data.medias !== this.props.data.medias) {
      props.updateList(props.data.medias.edges)
    }

    const isCurrent = edge => edge.cursor === props.current
    const currentIndex = props.data.medias.edges.findIndex(isCurrent)

    if (!isLoading && props.data.medias.edges.length - currentIndex < 10)
      this.props.loadMore()
  }

  render() {
    const {data, play, loadMore} = this.props
    return (
      <div>
        {!data || data.loading
          ? <h2>Loading...</h2>
          : <div>
              {data.medias.edges.map(edge =>
                <MediaCard
                  key={edge.cursor}
                  list={this.props.uniqueId}
                  cursor={edge.cursor}
                  onPlay={() => play(this.props.player, edge.cursor)}
                  {...edge.node}
                />,
              )}
              {data.medias.pageInfo.hasNextPage
                ? <Button {...loadMoreStyle} outline onClick={loadMore}>
                    Load More...
                  </Button>
                : <P textAlign="center">
                    That's all folks{" "}
                    <span role="img" aria-label="Hand">
                      👋
                    </span>
                  </P>}
            </div>}
      </div>
    )
  }
}

const mapStateToProps = ({player}) => ({
  current: player.current,
  playing: player.playing,
  player,
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  play: (player, cursor) => {
    if (player.list === ownProps.uniqueId && cursor === player.current)
      player.playing ? dispatch(pause()) : dispatch(play())
    else dispatch(start(ownProps.uniqueId, cursor))
  },
  updateList: list => {
    dispatch(updateList(ownProps.uniqueId, list))
  },
})

export function withMedias(
  graphqlQuery,
  uniqueId,
  mediasPath = "medias",
  vars = () => {},
) {
  return graphql(graphqlQuery, {
    options: props => ({variables: vars(props)}),
    props: ({data, ownProps: props}) => ({
      data,
      uniqueId: typeof uniqueId === "string" ? uniqueId : uniqueId(props),
      loadMore: () =>
        data.fetchMore({
          variables: {after: _get(data, mediasPath).pageInfo.endCursor},
          updateQuery: (prev, {fetchMoreResult}) => {
            if (!fetchMoreResult) return prev
            let newData = {
              ...fetchMoreResult,
            }

            _set(newData, mediasPath, {
              edges: [
                ..._get(prev, mediasPath).edges,
                ..._get(fetchMoreResult, mediasPath).edges,
              ],
              pageInfo: _get(fetchMoreResult, mediasPath).pageInfo,
              totalCount: _get(fetchMoreResult, mediasPath).totalCount,
            })
            return newData
          },
        }),
    }),
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaList)
