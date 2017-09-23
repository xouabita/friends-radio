export function play() {
  return {
    type: "PLAY",
  }
}

export function pause() {
  return {
    type: "PAUSE",
  }
}

export function setCurrent(cursor) {
  return {
    type: "SET_CURRENT",
    payload: cursor,
  }
}

export function start(list, current) {
  return {
    type: "START",
    payload: {
      list,
      current,
    },
  }
}
