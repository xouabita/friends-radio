export default function medias(state = {}, action) {
  if (action.type === 'UPDATE_LIST') {
    return { ...state, [action.payload.name]: [...action.payload.list] }
  } else {
    return state
  }
}
