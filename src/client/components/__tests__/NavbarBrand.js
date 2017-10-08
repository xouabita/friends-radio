import React from "react"
import {shallow} from "enzyme"

import NavbarBrand from "../NavbarBrand"

test("NavbarBrand", () => {
  const wrapper = shallow(
    <NavbarBrand className="foo" otherProps="bar" to="lol">
      Brand.
    </NavbarBrand>,
  )
  expect(wrapper).toMatchSnapshot()
})
