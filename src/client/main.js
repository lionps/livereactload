import startClient from "./startClient"
import {handleChange, patchModule} from "./handleChange"
import {info, error} from "./console"

module.exports = function client(opts, start = startClient) {
  const scope$$ = window.__livereactload$$
  scope$$.options = opts
  start(scope$$, {
    change(msg) {
      info("Bundle changed")
      handleChange(scope$$, msg.data)
    },
    module(msg) {
      info("Module change")
      patchModule(scope$$, msg.data)
    },
    bundle_error(msg) {
      error(msg.data.error)
    },
    ping(msg) {
      return {type:"pong"}
    }
  })
}
