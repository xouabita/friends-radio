const initialState = {
  list: null,
  current: null,
  playing: false,
}

export default function playerReducer(state = initialState, action) {
  switch (action.type) {
    case "PLAY":
      return {...state, playing: true}
    case "START":
      const {list, current} = action.payload
      return {
        ...state,
        playing: true,
        current,
        list,
      }
    case "PAUSE":
      return {...state, playing: false}
    case "SET_CURRENT":
      return {...state, current: action.payload}
    default:
      return state
  }
}
