import React from "react"
import {shallow} from "enzyme"

import Thumbnail, {Wrapper} from "../Thumbnail"

test("it should pass props correctly", () => {
  const wrapper = shallow(
    <Thumbnail
      src="foobar"
      customProps
      custom="withArgs"
      style={{foo: "bar"}}
    />,
  )
  const props = wrapper.find("div").props()
  expect(props).toMatchSnapshot()
})

test("active/inactive", () => {
  const active = shallow(<Thumbnail active={true} />)
  const inactive = shallow(<Thumbnail active={false} />)
  expect(active.find(Wrapper).props().style).toEqual({opacity: 1})
  expect(inactive.find(Wrapper).props().style).toEqual({opacity: 0})
})

it("should pass children", () => {
  const wrapper = shallow(
    <Thumbnail>
      <p>Hello</p>
      <span>World</span>
    </Thumbnail>,
  )
  expect(wrapper.find(Wrapper).children()).toMatchSnapshot()
})
