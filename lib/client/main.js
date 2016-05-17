function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _startClient = require("./startClient");

var _startClient2 = _interopRequireDefault(_startClient);

var _handleChange = require("./handleChange");

var _console = require("./console");

module.exports = function client(opts) {
  var start = arguments.length <= 1 || arguments[1] === undefined ? _startClient2["default"] : arguments[1];

  var scope$$ = window.__livereactload$$;
  scope$$.options = opts;
  start(scope$$, {
    change: function change(msg) {
      (0, _console.info)("Bundle changed");
      handleChanges(scope$$, msg.data);
    },
    module: function module(msg) {
      (0, _console.info)("Module change");
      var module = msg.data;
      Object.assign(scope$$.modules[msg.data.id], msg.data);
      (0, _handleChange.patchModule)(scope$$, msg.data);
      if (module.id.indexOf(".mxml.") > 0) {
        var pairModuleId = module.id.replace(".mxml", "");
        var pairModule = scope$$.modules[pairModuleId];
        if (pairModule) {
          (0, _handleChange.patchModule)(scope$$, pairModule);
        }
      }
    },
    bundle_error: function bundle_error(msg) {
      (0, _console.error)(msg.data.error);
    },
    ping: function ping(msg) {
      return { type: "pong" };
    }
  });
};