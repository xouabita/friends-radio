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

export function next() {
  return {
    type: 'NEXT'
  }
}

export function prev() {
  return {
    type: 'PREV'
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
