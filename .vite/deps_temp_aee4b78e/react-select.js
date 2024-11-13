import {
  Select,
  components,
  createFilter,
  defaultTheme,
  mergeStyles,
  useStateManager
} from "./chunk-2YV2GEYY.js";
import "./chunk-YSXNGHG6.js";
import "./chunk-24N6PQNM.js";
import "./chunk-GGRWX54N.js";
import "./chunk-3CXHZZPY.js";
import "./chunk-GEZNHLAX.js";
import "./chunk-TND5OJFW.js";
import "./chunk-6ZV7BBCU.js";
import "./chunk-V6SKUYQ7.js";
import "./chunk-3SGDXURX.js";
import "./chunk-D2SPSAYB.js";
import "./chunk-QZEM3JHO.js";
import {
  require_react_dom
} from "./chunk-7RZVQRLL.js";
import "./chunk-RI6IZD6A.js";
import {
  CacheProvider
} from "./chunk-EEIJKGKR.js";
import "./chunk-GHAB2VAF.js";
import {
  _extends,
  init_extends
} from "./chunk-BHQZLMRL.js";
import {
  createCache
} from "./chunk-JEQSSX2J.js";
import "./chunk-3VPJLSJG.js";
import {
  require_react
} from "./chunk-Y4QS4IRT.js";
import {
  __toESM
} from "./chunk-PLDDJCW6.js";

// node_modules/react-select/dist/react-select.esm.js
init_extends();
var React = __toESM(require_react());
var import_react = __toESM(require_react());
var import_react_dom = __toESM(require_react_dom());
var StateManagedSelect = (0, import_react.forwardRef)(function(props, ref) {
  var baseSelectProps = useStateManager(props);
  return React.createElement(Select, _extends({
    ref
  }, baseSelectProps));
});
var StateManagedSelect$1 = StateManagedSelect;
var NonceProvider = function(_ref) {
  var nonce = _ref.nonce, children = _ref.children, cacheKey = _ref.cacheKey;
  var emotionCache = (0, import_react.useMemo)(function() {
    return createCache({
      key: cacheKey,
      nonce
    });
  }, [cacheKey, nonce]);
  return React.createElement(CacheProvider, {
    value: emotionCache
  }, children);
};
export {
  NonceProvider,
  components,
  createFilter,
  StateManagedSelect$1 as default,
  defaultTheme,
  mergeStyles,
  useStateManager
};
//# sourceMappingURL=react-select.js.map
