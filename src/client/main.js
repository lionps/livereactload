import startClient from "./startClient"
import {handleChange, patchModule} from "./handleChange"
import {info, error} from "./console"

module.exports = function client(opts, start = startClient) {
  const scope$$ = window.__livereactload$$
  scope$$.options = opts
  start(scope$$, {
    change(msg) {
      info("Bundle changed")
      handleChanges(scope$$, msg.data)
    },
    module(msg) {
      info("Module change")
      Object.assign(scope$$.modules[msg.data.id], msg.data);
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
