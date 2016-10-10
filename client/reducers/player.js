const initialState = {
  playing: false,
  current: null
}

export default function playerReducer(state = initialState, action) {
  switch (action.type) {
    case 'PLAY':
      if (action.payload)
        return { playing: true, current: action.payload }
      else
        return { ...state, playing: true }
    case 'PAUSE':
      return { ...state, playing: false }
    default:
      return state
  }
}
