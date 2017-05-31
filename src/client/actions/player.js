export function play() {
  return {
    type: 'PLAY'
  }
}

export function pause() {
  return {
    type: 'PAUSE'
  }
}

export function next(skip = 1) {
  return {
    type: 'NEXT',
    payload: skip
  }
}

export function prev(skip = 1) {
  return {
    type: 'PREV',
    payload: skip
  }
}

export function start(history, current, queue) {
  return {
    type: 'START',
    payload: {
      history,
      current,
      queue
    }
  }
}
