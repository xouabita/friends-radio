const invalidYoutube = "https://www.youtube.com/watch?v=GFIVqvGc0KE"
const validYoutube = "https://www.youtube.com/watch?v=9bZkp7q19f0"
const invalidSoundcloud =
  "https://soundcloud.com/leo-roi-malhxrbx/valerie-damidot"
const validSoundcloud =
  "https://soundcloud.com/diplo/jack-u-take-u-there-feat-kiesza?in=jacku/sets/skrillex-diplo-present-jack-u"

const isValidTrack = require("../isValidTrack")

test("it should detect invalid youtube link", async () => {
  expect(await isValidTrack(invalidYoutube)).toBeFalsy()
})

test("it should detect valid youtube link", async () => {
  expect(await isValidTrack(validYoutube)).toBeTruthy()
})

test("it should detect invalid soundcloud link", async () => {
  expect(await isValidTrack(invalidSoundcloud)).toBeFalsy()
})

test("it should detect valid soundcloud link", async () => {
  expect(await isValidTrack(validSoundcloud)).toBeTruthy()
})
