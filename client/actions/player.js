export function play(media) {
  return {
    type: 'PLAY',
    payload: media
  }
}

export function pause() {
  return {
    type: 'PAUSE'
  }
}
