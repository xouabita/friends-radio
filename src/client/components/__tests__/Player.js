import React from "react"
import {shallow} from "enzyme"

import {
  Player,
  PlayerThumb,
  Prev,
  Next,
  Like,
  Dislike,
  Title,
  Play,
} from "../Player"
import Queue from "../Queue"

describe("Render without current music", () => {
  const props = {
    playing: false,
    current: null,
    cursor: null,
    queue: [],
    history: [],
  }
  const wrapper = shallow(<Player {...props} />)

  it("should set a default thumbnail", () => {
    const {src} = wrapper.find(PlayerThumb).props()
    expect(src).toMatchSnapshot()
  })

  it("should have an empty title", () => {
    const title = wrapper.find(Title).props().children
    expect(title).toBe("")
  })
})

describe("Render with current music", () => {
  const defaultProps = {
    playing: false,
    current: {
      id: "music_id",
      title: "music_title",
    },
    cursor: "current_cursor",
    queue: ["queue_1", "queue_2"],
    history: ["history_2", "history_1"],
    setCurrent: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
  }

  describe("not playing", () => {
    const props = defaultProps
    const wrapper = shallow(<Player {...props} />)

    it("should display prev/next", () => {
      const prevStyle = wrapper.find(Prev).props().style
      const nextStyle = wrapper.find(Next).props().style
      expect(prevStyle).toBeNull()
      expect(nextStyle).toBeNull()
    })

    it("should display reactions", () => {
      const like = wrapper.find(Like)
      const dislike = wrapper.find(Dislike)
      expect(like.props()).toMatchSnapshot()
      expect(dislike.props()).toMatchSnapshot()
    })

    it("should have a correct title", () => {
      const title = wrapper.find(Title).props().children
      expect(title).toBe("music_title")
    })

    it("should display a queue", () => {
      const queue = wrapper.find(Queue)
      expect(queue.props()).toMatchSnapshot()
    })

    it("should display correct play button", () => {
      const play = wrapper.find(Play)
      expect(play.props().playing).toBeFalsy()
      expect(play.props().onClick).toBe(props.play)
    })
  })

  describe("not playing", () => {
    const props = Object.assign({}, defaultProps, {playing: true})
    const wrapper = shallow(<Player {...props} />)

    it("should display correct play button", () => {
      const play = wrapper.find(Play)
      expect(play.props().playing).toBeTruthy()
      expect(play.props().onClick).toBe(props.pause)
    })
  })

  test("liked", () => {
    const props = Object.assign({}, defaultProps)
    props.current.myReaction = {type: "LIKE"}
    const wrapper = shallow(<Player {...props} />)

    const like = wrapper.find(Like)
    const dislike = wrapper.find(Dislike)
    expect(like.props().status).toBe("active")
    expect(dislike.props().status).toBe("inactive")
  })

  test("disliked", () => {
    const props = Object.assign({}, defaultProps)
    props.current.myReaction = {type: "DISLIKE"}
    const wrapper = shallow(<Player {...props} />)

    const like = wrapper.find(Like)
    const dislike = wrapper.find(Dislike)
    expect(like.props().status).toBe("inactive")
    expect(dislike.props().status).toBe("active")
  })

  test("without queue", () => {
    const props = Object.assign({}, defaultProps, {queue: []})
    const wrapper = shallow(<Player {...props} />)

    const prevStyle = wrapper.find(Prev).props().style
    const nextStyle = wrapper.find(Next).props().style
    expect(prevStyle).toBeNull()
    expect(nextStyle).toEqual({display: "none"})
  })

  test("without history", () => {
    const props = Object.assign({}, defaultProps, {history: []})
    const wrapper = shallow(<Player {...props} />)

    const prevStyle = wrapper.find(Prev).props().style
    const nextStyle = wrapper.find(Next).props().style
    expect(prevStyle).toEqual({display: "none"})
    expect(nextStyle).toBeNull()
  })
})

test("Like", () => {
  const wrapper = shallow(<Like />)
  expect(wrapper.props().type).toBe("like")
})

test("Dislike", () => {
  const wrapper = shallow(<Dislike />)
  expect(wrapper.props().type).toBe("dislike")
})

describe("next", () => {
  test("next when no disliked", () => {
    const queue = [
      {
        cursor: "working",
        node: {},
      },
    ]
    const setCurrent = jest.fn()
    const wrapper = shallow(<Player queue={queue} setCurrent={setCurrent} />)

    wrapper.find(Next).simulate("click")
    expect(setCurrent).toBeCalledWith("working")
  })

  test("next when disliked", () => {
    const queue = [
      {
        cursor: "not working",
        node: {
          myReaction: {type: "DISLIKE"},
        },
      },
      {
        cursor: "working",
        node: {},
      },
    ]
    const setCurrent = jest.fn()
    const wrapper = shallow(<Player queue={queue} setCurrent={setCurrent} />)

    wrapper.find(Next).simulate("click")
    expect(setCurrent).toBeCalledWith("working")
  })

  test("next when no valid track", () => {
    const queue = [
      {
        cursor: "not working",
        node: {
          myReaction: {type: "DISLIKE"},
        },
      },
    ]
    const setCurrent = jest.fn()
    const wrapper = shallow(<Player queue={queue} setCurrent={setCurrent} />)

    wrapper.find(Next).simulate("click")
    expect(setCurrent).toBeCalledWith(null)
  })
})

describe("prev", () => {
  test("prev when no disliked", () => {
    const history = [
      {
        cursor: "working",
        node: {},
      },
    ]
    const setCurrent = jest.fn()
    const wrapper = shallow(
      <Player history={history} setCurrent={setCurrent} />,
    )

    wrapper.find(Prev).simulate("click")
    expect(setCurrent).toBeCalledWith("working")
  })

  test("prev when disliked", () => {
    const history = [
      {
        cursor: "working",
        node: {},
      },
      {
        cursor: "not working",
        node: {
          myReaction: {type: "DISLIKE"},
        },
      },
    ]
    const setCurrent = jest.fn()
    const wrapper = shallow(
      <Player history={history} setCurrent={setCurrent} />,
    )

    wrapper.find(Prev).simulate("click")
    expect(setCurrent).toBeCalledWith("working")
  })

  test("prev when no valid track", () => {
    const history = [
      {
        cursor: "not working",
        node: {
          myReaction: {type: "DISLIKE"},
        },
      },
    ]
    const setCurrent = jest.fn()
    const wrapper = shallow(
      <Player history={history} setCurrent={setCurrent} />,
    )

    wrapper.find(Prev).simulate("click")
    expect(setCurrent).toBeCalledWith(null)
  })
})
