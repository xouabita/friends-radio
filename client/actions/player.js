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
