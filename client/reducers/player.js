const initialState = {
  list: null,
  current: null,
  playing: false,
}

export default function playerReducer(state = initialState, action) {
  switch (action.type) {
    case 'PLAY':
      return { ...state, playing: true }
    case 'START':
      const { list, current, play } = action.payload
      return {
        ...state,
        playing: play,
        current,
        list,
      }
    case 'PAUSE':
      return { ...state, playing: false }
    case 'NEXT':
      return {
        ...state,
        current: state.current + 1
      }
    case 'PREV':
      return {
        ...state,
        current: state.current - 1
      }
    default:
      return state
  }
}
