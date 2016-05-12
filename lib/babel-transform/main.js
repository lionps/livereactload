var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _reactProxy = require("react-proxy");

module.exports = function babelPluginLiveReactload(_ref) {
  var filename = _ref.filename;
  var components = _ref.components;
  var imports = _ref.imports;
  var locals = _ref.locals;

  var _imports = _slicedToArray(imports, 1);

  var React = _imports[0];

  var forceUpdate = (0, _reactProxy.getForceUpdate)(React);

  return function applyProxy(Component, uniqueId) {
    var _components$uniqueId = components[uniqueId];
    var displayName = _components$uniqueId.displayName;
    var _components$uniqueId$isInFunction = _components$uniqueId.isInFunction;
    var isInFunction = _components$uniqueId$isInFunction === undefined ? false : _components$uniqueId$isInFunction;

    var proxies = getProxies();

    if (!proxies || isInFunction) {
      return Component;
    }

    var id = filename + "$$" + uniqueId;
    if (!proxies[id]) {
      var proxy = (0, _reactProxy.createProxy)(Component);
      proxies[id] = proxy;
      return proxy.get();
    } else {
      var _ret = (function () {
        console.log(" > Patch component :: ", displayName || uniqueId);
        var proxy = proxies[id];
        var instances = proxy.update(Component);
        setTimeout(function () {
          return instances.forEach(forceUpdate);
        }, 0);
        return {
          v: proxy.get()
        };
      })();

      if (typeof _ret === "object") return _ret.v;
    }
  };
};

function getProxies() {
  try {
    if (typeof window !== "undefined") {
      return window.__lrproxies$$ = window.__lrproxies$$ || {};
    } else {}
  } catch (ignore) {}
}