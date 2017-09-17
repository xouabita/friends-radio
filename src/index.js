const http = require("http")
const app = require("./server")

if (module.hot) {
  module.hot.accept("./server", function() {
    console.log("🔁  HMR Reloading `./server`...")
  })
  console.info("✅  Server-side HMR Enabled!")
}

const server = http.createServer(app)
server.listen(process.env.PORT || 3000)

if (module.hot) {
  console.info("✅  Server-side HMR Enabled!")
  let currentApp = app

  module.hot.accept("./server", function() {
    console.log("🔁  HMR Reloading `./server`...")
    server.removeListener("request", currentApp)
    const newApp = require("./server")
    server.on("request", newApp)
    currentApp = newApp
  })
}
