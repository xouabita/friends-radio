import player from "../player"

test("initial state", () => {
  expect(player()).toEqual({
    list: null,
    current: null,
    playing: false,
  })
})

test("play/pause", () => {
  const prevState = {
    foo: "bar",
  }
  const state = player(prevState, {type: "PLAY"})
  expect(state).toEqual({
    foo: "bar",
    playing: true,
  })
  expect(player(state, {type: "PAUSE"})).toEqual({
    foo: "bar",
    playing: false,
  })
})

test("start", () => {
  const prevState = {
    playing: false,
    current: "A",
    list: "foo",
  }
  const action = {
    type: "START",
    payload: {
      list: "bar",
      current: "B",
    },
  }
  expect(player(prevState, action)).toEqual({
    playing: true,
    current: "B",
    list: "bar",
  })
})

test("set current", () => {
  const prevState = {
    playing: false,
    current: "A",
    list: "foo",
  }
  expect(player(prevState, {type: "SET_CURRENT", payload: "B"})).toEqual({
    playing: false,
    current: "B",
    list: "foo",
  })
})
