import {play, pause, setCurrent, start} from "../player"

test("play", () => {
  expect(play()).toMatchSnapshot()
})

test("pause", () => {
  expect(pause()).toMatchSnapshot()
})

test("setCurrent", () => {
  expect(setCurrent("cursor")).toMatchSnapshot()
})

test("start", () => {
  expect(start("foo", "bar")).toMatchSnapshot()
})
