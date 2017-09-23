import React from "react"
import glamorous, {Div} from "glamorous"

import Thumbnail from "./Thumbnail"

const thumbSize = 30
const QueueThumbnail = glamorous(Thumbnail)({
  height: thumbSize,
  width: thumbSize,
  display: "inline-block",
  verticalAlign: "middle",
})

const QueueItem = glamorous.div({
  borderTop: "2px solid rgba(0, 0, 0, .05)",
  padding: thumbSize * 0.25,
  ":hover": {cursor: "pointer"},
  "& p": {
    width: "calc(100% - 50px)",
    overflow: "hidden",
    whiteSpace: "nowrap",
    fontSize: 12,
    fontWeight: "bold",
    textOverflow: "ellipsis",
    margin: "0 10px",
    display: "inline-block",
    verticalAlign: "middle",
  },
})

export default function Queue({medias, setCurrent}) {
  return (
    <Div overflow="scroll" flex={1}>
      {medias.map(media =>
        <QueueItem onClick={() => setCurrent(media.cursor)} key={media.cursor}>
          <QueueThumbnail src={media.node.thumbnail} active={false} />
          <p>
            {media.node.title}
          </p>
        </QueueItem>,
      )}
    </Div>
  )
}
