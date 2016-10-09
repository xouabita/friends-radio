const initialState = {
  current: null
}

export default function playerReducer(state = initialState, action) {
  switch (action.type) {
    case 'PLAY':
      return { current: action.payload }
    default:
      return state
  }
}
