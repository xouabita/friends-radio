import medias from "../medias"

test("default state", () => {
  expect(medias()).toEqual({})
})

test("update list", () => {
  const action = {
    type: "UPDATE_LIST",
    payload: {
      name: "myList",
      list: ["foo", "bar", "lol"],
    },
  }
  const previousState = {
    list1: ["hello", "world"],
  }
  expect(medias(previousState, action)).toEqual({
    list1: ["hello", "world"],
    myList: ["foo", "bar", "lol"],
  })
})
