import {updateList} from "../medias"

test("updateList", () => {
  expect(updateList("test_name", "test_list")).toMatchSnapshot()
})
