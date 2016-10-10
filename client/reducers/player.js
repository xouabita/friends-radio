const initialState = {
  playing: false,
  current: null,
  queue: [],
  history: []
}

export default function playerReducer(state = initialState, action) {
  switch (action.type) {
    case 'PLAY':
      return { ...state, playing: true }
    case 'START':
      const { history, current, queue } = action.payload
      return {
        ...state,
        playing: true,
        history,
        current,
        queue
      }
    case 'PAUSE':
      return { ...state, playing: false }
    default:
      return state
  }
}
