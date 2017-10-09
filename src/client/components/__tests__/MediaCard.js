import React from "react"
import {shallow} from "enzyme"
import {MediaCard} from "../MediaCard"
import ReactionButton from "../ReactionButton"
import PlayButton from "../PlayButton"
import Thumbnail from "../Thumbnail"

describe("Reaction buttons", () => {
  it("should render two reactions buttons with correct mediaId", () => {
    const wrapper = shallow(<MediaCard id="1234" />)
    const [like, dislike] = wrapper.find(ReactionButton)
    expect(like.props.type).toBe("like")
    expect(dislike.props.type).toBe("dislike")
    expect(like.props.status).toBe("normal")
    expect(dislike.props.status).toBe("normal")
    expect(like.props.mediaId).toBe("1234")
    expect(dislike.props.mediaId).toBe("1234")
  })

  it("should render with a like", () => {
    const wrapper = shallow(<MediaCard myReaction={{type: "LIKE"}} />)
    const [like, dislike] = wrapper.find(ReactionButton)
    expect(like.props.status).toBe("active")
    expect(dislike.props.status).toBe("inactive")
  })

  it("should render with a dislike", () => {
    const wrapper = shallow(<MediaCard myReaction={{type: "DISLIKE"}} />)
    const [like, dislike] = wrapper.find(ReactionButton)
    expect(like.props.status).toBe("inactive")
    expect(dislike.props.status).toBe("active")
  })
})

describe("should update the play button when play/pause", () => {
  test("playing", () => {
    const playing = shallow(<MediaCard playing={true} />)
    const [thumbnail] = playing.find(Thumbnail)
    const [playButton] = playing.find(PlayButton)
    expect(thumbnail.props.active).toBeTruthy()
    expect(playButton.props.playing).toBeTruthy()
  })
  test("not playing", () => {
    const playing = shallow(<MediaCard playing={false} />)
    const [thumbnail] = playing.find(Thumbnail)
    const [playButton] = playing.find(PlayButton)
    expect(thumbnail.props.active).toBeFalsy()
    expect(playButton.props.playing).toBeFalsy()
  })
})

describe("title display", () => {
  test("without artist", () => {
    const wrapper = shallow(<MediaCard title="My Title" />)
    expect(wrapper.find("h5").text()).toBe("My Title")
  })

  test("with artist", () => {
    const wrapper = shallow(<MediaCard title="My Title" artist="Artist" />)
    expect(wrapper.find("h5").text()).toBe("Artist - My Title")
  })
})

test("with posted_by", () => {
  const postedBy = {
    name: "Kevin",
    id: "1234",
  }
  const wrapper = shallow(<MediaCard posted_by={postedBy} />)
  const linkPostedBy = wrapper.find({to: "/u/1234"})
  expect(linkPostedBy.children().render().text()).toBe("Posted by Kevin")
})

test("should call onPlay when PlayButton is clicked", () => {
  const onPlay = jest.fn()
  const wrapper = shallow(<MediaCard onPlay={onPlay} />)
  const playButton = wrapper.find(PlayButton)

  playButton.simulate("click")
  expect(onPlay).toBeCalled()
})
