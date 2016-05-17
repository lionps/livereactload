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
      let module = msg.data;
      Object.assign(scope$$.modules[msg.data.id], msg.data);
      patchModule(scope$$, msg.data)
      if (module.id.indexOf(".mxml.") > 0) {
        let pairModuleId = module.id.replace(".mxml", "");
        let pairModule = scope$$.modules[pairModuleId];
        if (pairModule) {
          patchModule(scope$$, pairModule);
        }
      }
    },
    bundle_error(msg) {
      error(msg.data.error)
    },
    ping(msg) {
      return {type:"pong"}
    }
  })
}
