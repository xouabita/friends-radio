export function updateList(name, list) {
  return {
    type: 'UPDATE_LIST',
    payload: { name, list }
  }
}
