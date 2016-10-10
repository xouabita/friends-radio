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
    case 'NEXT':
      if (state.queue.length === 0)
        return { ...state, playing: false }
      const newState = Object.assign({}, state)
      newState.history.push(newState.current)
      newState.current = newState.queue.shift()
      return newState
    case 'PREV':
      if (state.history.length === 0)
        return state
      const newStateBis = Object.assign({}, state)
      newStateBis.queue.unshift(newStateBis.current)
      newStateBis.current = newStateBis.history.pop()
      return newStateBis
    default:
      return state
  }
}
