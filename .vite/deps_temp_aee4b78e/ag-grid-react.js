import {
  ag_grid_community_auto_esm_exports,
  init_ag_grid_community_auto_esm
} from "./chunk-OJYERM66.js";
import {
  require_react_dom
} from "./chunk-7RZVQRLL.js";
import {
  require_prop_types
} from "./chunk-RAGCF636.js";
import "./chunk-3VPJLSJG.js";
import {
  require_react
} from "./chunk-Y4QS4IRT.js";
import {
  __commonJS,
  __toCommonJS
} from "./chunk-PLDDJCW6.js";

// node_modules/ag-grid-react/lib/shared/reactComponent.js
var require_reactComponent = __commonJS({
  "node_modules/ag-grid-react/lib/shared/reactComponent.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReactComponent = void 0;
    var BaseReactComponent = (
      /** @class */
      /* @__PURE__ */ function() {
        function BaseReactComponent2() {
        }
        return BaseReactComponent2;
      }()
    );
    var ReactComponent = (
      /** @class */
      function(_super) {
        __extends(ReactComponent2, _super);
        function ReactComponent2(reactComponent, portalManager, componentType) {
          var _this = _super.call(this) || this;
          _this.portal = null;
          _this.reactComponent = reactComponent;
          _this.portalManager = portalManager;
          _this.componentType = componentType;
          _this.statelessComponent = _this.isStateless(_this.reactComponent);
          return _this;
        }
        ReactComponent2.prototype.getGui = function() {
          return this.eParentElement;
        };
        ReactComponent2.prototype.destroy = function() {
          if (this.componentInstance && typeof this.componentInstance.destroy == "function") {
            this.componentInstance.destroy();
          }
          return this.portalManager.destroyPortal(this.portal);
        };
        ReactComponent2.prototype.createParentElement = function(params) {
          var componentWrappingElement = this.portalManager.getComponentWrappingElement();
          var eParentElement = document.createElement(componentWrappingElement || "div");
          eParentElement.classList.add("ag-react-container");
          params.reactContainer = eParentElement;
          return eParentElement;
        };
        ReactComponent2.prototype.addParentContainerStyleAndClasses = function() {
          var _this = this;
          if (!this.componentInstance) {
            return;
          }
          if (this.componentInstance.getReactContainerStyle && this.componentInstance.getReactContainerStyle()) {
            Object.assign(this.eParentElement.style, this.componentInstance.getReactContainerStyle());
          }
          if (this.componentInstance.getReactContainerClasses && this.componentInstance.getReactContainerClasses()) {
            var parentContainerClasses = this.componentInstance.getReactContainerClasses();
            parentContainerClasses.forEach(function(className) {
              return _this.eParentElement.classList.add(className);
            });
          }
        };
        ReactComponent2.prototype.statelessComponentRendered = function() {
          return this.eParentElement.childElementCount > 0 || this.eParentElement.childNodes.length > 0;
        };
        ReactComponent2.prototype.getFrameworkComponentInstance = function() {
          return this.componentInstance;
        };
        ReactComponent2.prototype.isStatelessComponent = function() {
          return this.statelessComponent;
        };
        ReactComponent2.prototype.getReactComponentName = function() {
          return this.reactComponent.name;
        };
        ReactComponent2.prototype.getMemoType = function() {
          return this.hasSymbol() ? Symbol.for("react.memo") : 60115;
        };
        ReactComponent2.prototype.hasSymbol = function() {
          return typeof Symbol === "function" && Symbol.for;
        };
        ReactComponent2.prototype.isStateless = function(Component) {
          return typeof Component === "function" && !(Component.prototype && Component.prototype.isReactComponent) || typeof Component === "object" && Component.$$typeof === this.getMemoType();
        };
        ReactComponent2.prototype.hasMethod = function(name) {
          var frameworkComponentInstance = this.getFrameworkComponentInstance();
          return !!frameworkComponentInstance && frameworkComponentInstance[name] !== null || this.fallbackMethodAvailable(name);
        };
        ReactComponent2.prototype.callMethod = function(name, args) {
          var _this = this;
          var frameworkComponentInstance = this.getFrameworkComponentInstance();
          if (this.isStatelessComponent()) {
            return this.fallbackMethod(name, !!args && args[0] ? args[0] : {});
          } else if (!!!frameworkComponentInstance) {
            setTimeout(function() {
              return _this.callMethod(name, args);
            });
            return;
          }
          var method = frameworkComponentInstance[name];
          if (!!method) {
            return method.apply(frameworkComponentInstance, args);
          }
          if (this.fallbackMethodAvailable(name)) {
            return this.fallbackMethod(name, !!args && args[0] ? args[0] : {});
          }
        };
        ReactComponent2.prototype.addMethod = function(name, callback) {
          this[name] = callback;
        };
        return ReactComponent2;
      }(BaseReactComponent)
    );
    exports.ReactComponent = ReactComponent;
  }
});

// node_modules/react-dom/cjs/react-dom-server-legacy.browser.development.js
var require_react_dom_server_legacy_browser_development = __commonJS({
  "node_modules/react-dom/cjs/react-dom-server-legacy.browser.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        var React = require_react();
        var ReactVersion = "18.2.0";
        var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function warn(format) {
          {
            {
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              printWarning("warn", format, args);
            }
          }
        }
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        function scheduleWork(callback) {
          callback();
        }
        function beginWriting(destination) {
        }
        function writeChunk(destination, chunk) {
          writeChunkAndReturn(destination, chunk);
        }
        function writeChunkAndReturn(destination, chunk) {
          return destination.push(chunk);
        }
        function completeWriting(destination) {
        }
        function close(destination) {
          destination.push(null);
        }
        function stringToChunk(content) {
          return content;
        }
        function stringToPrecomputedChunk(content) {
          return content;
        }
        function closeWithError(destination, error2) {
          destination.destroy(error2);
        }
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e) {
              return true;
            }
          }
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkAttributeStringCoercion(value, attributeName) {
          {
            if (willCoercionThrow(value)) {
              error("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", attributeName, typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        function checkCSSPropertyStringCoercion(value, propName) {
          {
            if (willCoercionThrow(value)) {
              error("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", propName, typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        function checkHtmlStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var RESERVED = 0;
        var STRING = 1;
        var BOOLEANISH_STRING = 2;
        var BOOLEAN = 3;
        var OVERLOADED_BOOLEAN = 4;
        var NUMERIC = 5;
        var POSITIVE_NUMERIC = 6;
        var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
        var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
        var VALID_ATTRIBUTE_NAME_REGEX = new RegExp("^[" + ATTRIBUTE_NAME_START_CHAR + "][" + ATTRIBUTE_NAME_CHAR + "]*$");
        var illegalAttributeNameCache = {};
        var validatedAttributeNameCache = {};
        function isAttributeNameSafe(attributeName) {
          if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) {
            return true;
          }
          if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) {
            return false;
          }
          if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
            validatedAttributeNameCache[attributeName] = true;
            return true;
          }
          illegalAttributeNameCache[attributeName] = true;
          {
            error("Invalid attribute name: `%s`", attributeName);
          }
          return false;
        }
        function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
          if (propertyInfo !== null && propertyInfo.type === RESERVED) {
            return false;
          }
          switch (typeof value) {
            case "function":
            case "symbol":
              return true;
            case "boolean": {
              if (isCustomComponentTag) {
                return false;
              }
              if (propertyInfo !== null) {
                return !propertyInfo.acceptsBooleans;
              } else {
                var prefix2 = name.toLowerCase().slice(0, 5);
                return prefix2 !== "data-" && prefix2 !== "aria-";
              }
            }
            default:
              return false;
          }
        }
        function getPropertyInfo(name) {
          return properties.hasOwnProperty(name) ? properties[name] : null;
        }
        function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL2, removeEmptyString) {
          this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
          this.attributeName = attributeName;
          this.attributeNamespace = attributeNamespace;
          this.mustUseProperty = mustUseProperty;
          this.propertyName = name;
          this.type = type;
          this.sanitizeURL = sanitizeURL2;
          this.removeEmptyString = removeEmptyString;
        }
        var properties = {};
        var reservedProps = [
          "children",
          "dangerouslySetInnerHTML",
          // TODO: This prevents the assignment of defaultValue to regular
          // elements (not just inputs). Now that ReactDOMInput assigns to the
          // defaultValue property -- do we need this?
          "defaultValue",
          "defaultChecked",
          "innerHTML",
          "suppressContentEditableWarning",
          "suppressHydrationWarning",
          "style"
        ];
        reservedProps.forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            RESERVED,
            false,
            // mustUseProperty
            name,
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(_ref) {
          var name = _ref[0], attributeName = _ref[1];
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            // mustUseProperty
            attributeName,
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEANISH_STRING,
            false,
            // mustUseProperty
            name.toLowerCase(),
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEANISH_STRING,
            false,
            // mustUseProperty
            name,
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        [
          "allowFullScreen",
          "async",
          // Note: there is a special case that prevents it from being written to the DOM
          // on the client side because the browsers are inconsistent. Instead we call focus().
          "autoFocus",
          "autoPlay",
          "controls",
          "default",
          "defer",
          "disabled",
          "disablePictureInPicture",
          "disableRemotePlayback",
          "formNoValidate",
          "hidden",
          "loop",
          "noModule",
          "noValidate",
          "open",
          "playsInline",
          "readOnly",
          "required",
          "reversed",
          "scoped",
          "seamless",
          // Microdata
          "itemScope"
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEAN,
            false,
            // mustUseProperty
            name.toLowerCase(),
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        [
          "checked",
          // Note: `option.selected` is not updated if `select.multiple` is
          // disabled with `removeAttribute`. We have special logic for handling this.
          "multiple",
          "muted",
          "selected"
          // NOTE: if you add a camelCased prop to this list,
          // you'll need to set attributeName to name.toLowerCase()
          // instead in the assignment below.
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEAN,
            true,
            // mustUseProperty
            name,
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        [
          "capture",
          "download"
          // NOTE: if you add a camelCased prop to this list,
          // you'll need to set attributeName to name.toLowerCase()
          // instead in the assignment below.
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            OVERLOADED_BOOLEAN,
            false,
            // mustUseProperty
            name,
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        [
          "cols",
          "rows",
          "size",
          "span"
          // NOTE: if you add a camelCased prop to this list,
          // you'll need to set attributeName to name.toLowerCase()
          // instead in the assignment below.
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            POSITIVE_NUMERIC,
            false,
            // mustUseProperty
            name,
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        ["rowSpan", "start"].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            NUMERIC,
            false,
            // mustUseProperty
            name.toLowerCase(),
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        var CAMELIZE = /[\-\:]([a-z])/g;
        var capitalize = function(token) {
          return token[1].toUpperCase();
        };
        [
          "accent-height",
          "alignment-baseline",
          "arabic-form",
          "baseline-shift",
          "cap-height",
          "clip-path",
          "clip-rule",
          "color-interpolation",
          "color-interpolation-filters",
          "color-profile",
          "color-rendering",
          "dominant-baseline",
          "enable-background",
          "fill-opacity",
          "fill-rule",
          "flood-color",
          "flood-opacity",
          "font-family",
          "font-size",
          "font-size-adjust",
          "font-stretch",
          "font-style",
          "font-variant",
          "font-weight",
          "glyph-name",
          "glyph-orientation-horizontal",
          "glyph-orientation-vertical",
          "horiz-adv-x",
          "horiz-origin-x",
          "image-rendering",
          "letter-spacing",
          "lighting-color",
          "marker-end",
          "marker-mid",
          "marker-start",
          "overline-position",
          "overline-thickness",
          "paint-order",
          "panose-1",
          "pointer-events",
          "rendering-intent",
          "shape-rendering",
          "stop-color",
          "stop-opacity",
          "strikethrough-position",
          "strikethrough-thickness",
          "stroke-dasharray",
          "stroke-dashoffset",
          "stroke-linecap",
          "stroke-linejoin",
          "stroke-miterlimit",
          "stroke-opacity",
          "stroke-width",
          "text-anchor",
          "text-decoration",
          "text-rendering",
          "underline-position",
          "underline-thickness",
          "unicode-bidi",
          "unicode-range",
          "units-per-em",
          "v-alphabetic",
          "v-hanging",
          "v-ideographic",
          "v-mathematical",
          "vector-effect",
          "vert-adv-y",
          "vert-origin-x",
          "vert-origin-y",
          "word-spacing",
          "writing-mode",
          "xmlns:xlink",
          "x-height"
          // NOTE: if you add a camelCased prop to this list,
          // you'll need to set attributeName to name.toLowerCase()
          // instead in the assignment below.
        ].forEach(function(attributeName) {
          var name = attributeName.replace(CAMELIZE, capitalize);
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            // mustUseProperty
            attributeName,
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        [
          "xlink:actuate",
          "xlink:arcrole",
          "xlink:role",
          "xlink:show",
          "xlink:title",
          "xlink:type"
          // NOTE: if you add a camelCased prop to this list,
          // you'll need to set attributeName to name.toLowerCase()
          // instead in the assignment below.
        ].forEach(function(attributeName) {
          var name = attributeName.replace(CAMELIZE, capitalize);
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            // mustUseProperty
            attributeName,
            "http://www.w3.org/1999/xlink",
            false,
            // sanitizeURL
            false
          );
        });
        [
          "xml:base",
          "xml:lang",
          "xml:space"
          // NOTE: if you add a camelCased prop to this list,
          // you'll need to set attributeName to name.toLowerCase()
          // instead in the assignment below.
        ].forEach(function(attributeName) {
          var name = attributeName.replace(CAMELIZE, capitalize);
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            // mustUseProperty
            attributeName,
            "http://www.w3.org/XML/1998/namespace",
            false,
            // sanitizeURL
            false
          );
        });
        ["tabIndex", "crossOrigin"].forEach(function(attributeName) {
          properties[attributeName] = new PropertyInfoRecord(
            attributeName,
            STRING,
            false,
            // mustUseProperty
            attributeName.toLowerCase(),
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        var xlinkHref = "xlinkHref";
        properties[xlinkHref] = new PropertyInfoRecord(
          "xlinkHref",
          STRING,
          false,
          // mustUseProperty
          "xlink:href",
          "http://www.w3.org/1999/xlink",
          true,
          // sanitizeURL
          false
        );
        ["src", "href", "action", "formAction"].forEach(function(attributeName) {
          properties[attributeName] = new PropertyInfoRecord(
            attributeName,
            STRING,
            false,
            // mustUseProperty
            attributeName.toLowerCase(),
            // attributeName
            null,
            // attributeNamespace
            true,
            // sanitizeURL
            true
          );
        });
        var isUnitlessNumber = {
          animationIterationCount: true,
          aspectRatio: true,
          borderImageOutset: true,
          borderImageSlice: true,
          borderImageWidth: true,
          boxFlex: true,
          boxFlexGroup: true,
          boxOrdinalGroup: true,
          columnCount: true,
          columns: true,
          flex: true,
          flexGrow: true,
          flexPositive: true,
          flexShrink: true,
          flexNegative: true,
          flexOrder: true,
          gridArea: true,
          gridRow: true,
          gridRowEnd: true,
          gridRowSpan: true,
          gridRowStart: true,
          gridColumn: true,
          gridColumnEnd: true,
          gridColumnSpan: true,
          gridColumnStart: true,
          fontWeight: true,
          lineClamp: true,
          lineHeight: true,
          opacity: true,
          order: true,
          orphans: true,
          tabSize: true,
          widows: true,
          zIndex: true,
          zoom: true,
          // SVG-related properties
          fillOpacity: true,
          floodOpacity: true,
          stopOpacity: true,
          strokeDasharray: true,
          strokeDashoffset: true,
          strokeMiterlimit: true,
          strokeOpacity: true,
          strokeWidth: true
        };
        function prefixKey(prefix2, key) {
          return prefix2 + key.charAt(0).toUpperCase() + key.substring(1);
        }
        var prefixes = ["Webkit", "ms", "Moz", "O"];
        Object.keys(isUnitlessNumber).forEach(function(prop) {
          prefixes.forEach(function(prefix2) {
            isUnitlessNumber[prefixKey(prefix2, prop)] = isUnitlessNumber[prop];
          });
        });
        var hasReadOnlyValue = {
          button: true,
          checkbox: true,
          image: true,
          hidden: true,
          radio: true,
          reset: true,
          submit: true
        };
        function checkControlledValueProps(tagName, props) {
          {
            if (!(hasReadOnlyValue[props.type] || props.onChange || props.onInput || props.readOnly || props.disabled || props.value == null)) {
              error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.");
            }
            if (!(props.onChange || props.readOnly || props.disabled || props.checked == null)) {
              error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
            }
          }
        }
        function isCustomComponent(tagName, props) {
          if (tagName.indexOf("-") === -1) {
            return typeof props.is === "string";
          }
          switch (tagName) {
            case "annotation-xml":
            case "color-profile":
            case "font-face":
            case "font-face-src":
            case "font-face-uri":
            case "font-face-format":
            case "font-face-name":
            case "missing-glyph":
              return false;
            default:
              return true;
          }
        }
        var ariaProperties = {
          "aria-current": 0,
          // state
          "aria-description": 0,
          "aria-details": 0,
          "aria-disabled": 0,
          // state
          "aria-hidden": 0,
          // state
          "aria-invalid": 0,
          // state
          "aria-keyshortcuts": 0,
          "aria-label": 0,
          "aria-roledescription": 0,
          // Widget Attributes
          "aria-autocomplete": 0,
          "aria-checked": 0,
          "aria-expanded": 0,
          "aria-haspopup": 0,
          "aria-level": 0,
          "aria-modal": 0,
          "aria-multiline": 0,
          "aria-multiselectable": 0,
          "aria-orientation": 0,
          "aria-placeholder": 0,
          "aria-pressed": 0,
          "aria-readonly": 0,
          "aria-required": 0,
          "aria-selected": 0,
          "aria-sort": 0,
          "aria-valuemax": 0,
          "aria-valuemin": 0,
          "aria-valuenow": 0,
          "aria-valuetext": 0,
          // Live Region Attributes
          "aria-atomic": 0,
          "aria-busy": 0,
          "aria-live": 0,
          "aria-relevant": 0,
          // Drag-and-Drop Attributes
          "aria-dropeffect": 0,
          "aria-grabbed": 0,
          // Relationship Attributes
          "aria-activedescendant": 0,
          "aria-colcount": 0,
          "aria-colindex": 0,
          "aria-colspan": 0,
          "aria-controls": 0,
          "aria-describedby": 0,
          "aria-errormessage": 0,
          "aria-flowto": 0,
          "aria-labelledby": 0,
          "aria-owns": 0,
          "aria-posinset": 0,
          "aria-rowcount": 0,
          "aria-rowindex": 0,
          "aria-rowspan": 0,
          "aria-setsize": 0
        };
        var warnedProperties = {};
        var rARIA = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
        var rARIACamel = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
        function validateProperty(tagName, name) {
          {
            if (hasOwnProperty.call(warnedProperties, name) && warnedProperties[name]) {
              return true;
            }
            if (rARIACamel.test(name)) {
              var ariaName = "aria-" + name.slice(4).toLowerCase();
              var correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;
              if (correctName == null) {
                error("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", name);
                warnedProperties[name] = true;
                return true;
              }
              if (name !== correctName) {
                error("Invalid ARIA attribute `%s`. Did you mean `%s`?", name, correctName);
                warnedProperties[name] = true;
                return true;
              }
            }
            if (rARIA.test(name)) {
              var lowerCasedName = name.toLowerCase();
              var standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;
              if (standardName == null) {
                warnedProperties[name] = true;
                return false;
              }
              if (name !== standardName) {
                error("Unknown ARIA attribute `%s`. Did you mean `%s`?", name, standardName);
                warnedProperties[name] = true;
                return true;
              }
            }
          }
          return true;
        }
        function warnInvalidARIAProps(type, props) {
          {
            var invalidProps = [];
            for (var key in props) {
              var isValid = validateProperty(type, key);
              if (!isValid) {
                invalidProps.push(key);
              }
            }
            var unknownPropString = invalidProps.map(function(prop) {
              return "`" + prop + "`";
            }).join(", ");
            if (invalidProps.length === 1) {
              error("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
            } else if (invalidProps.length > 1) {
              error("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
            }
          }
        }
        function validateProperties(type, props) {
          if (isCustomComponent(type, props)) {
            return;
          }
          warnInvalidARIAProps(type, props);
        }
        var didWarnValueNull = false;
        function validateProperties$1(type, props) {
          {
            if (type !== "input" && type !== "textarea" && type !== "select") {
              return;
            }
            if (props != null && props.value === null && !didWarnValueNull) {
              didWarnValueNull = true;
              if (type === "select" && props.multiple) {
                error("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", type);
              } else {
                error("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", type);
              }
            }
          }
        }
        var possibleStandardNames = {
          // HTML
          accept: "accept",
          acceptcharset: "acceptCharset",
          "accept-charset": "acceptCharset",
          accesskey: "accessKey",
          action: "action",
          allowfullscreen: "allowFullScreen",
          alt: "alt",
          as: "as",
          async: "async",
          autocapitalize: "autoCapitalize",
          autocomplete: "autoComplete",
          autocorrect: "autoCorrect",
          autofocus: "autoFocus",
          autoplay: "autoPlay",
          autosave: "autoSave",
          capture: "capture",
          cellpadding: "cellPadding",
          cellspacing: "cellSpacing",
          challenge: "challenge",
          charset: "charSet",
          checked: "checked",
          children: "children",
          cite: "cite",
          class: "className",
          classid: "classID",
          classname: "className",
          cols: "cols",
          colspan: "colSpan",
          content: "content",
          contenteditable: "contentEditable",
          contextmenu: "contextMenu",
          controls: "controls",
          controlslist: "controlsList",
          coords: "coords",
          crossorigin: "crossOrigin",
          dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
          data: "data",
          datetime: "dateTime",
          default: "default",
          defaultchecked: "defaultChecked",
          defaultvalue: "defaultValue",
          defer: "defer",
          dir: "dir",
          disabled: "disabled",
          disablepictureinpicture: "disablePictureInPicture",
          disableremoteplayback: "disableRemotePlayback",
          download: "download",
          draggable: "draggable",
          enctype: "encType",
          enterkeyhint: "enterKeyHint",
          for: "htmlFor",
          form: "form",
          formmethod: "formMethod",
          formaction: "formAction",
          formenctype: "formEncType",
          formnovalidate: "formNoValidate",
          formtarget: "formTarget",
          frameborder: "frameBorder",
          headers: "headers",
          height: "height",
          hidden: "hidden",
          high: "high",
          href: "href",
          hreflang: "hrefLang",
          htmlfor: "htmlFor",
          httpequiv: "httpEquiv",
          "http-equiv": "httpEquiv",
          icon: "icon",
          id: "id",
          imagesizes: "imageSizes",
          imagesrcset: "imageSrcSet",
          innerhtml: "innerHTML",
          inputmode: "inputMode",
          integrity: "integrity",
          is: "is",
          itemid: "itemID",
          itemprop: "itemProp",
          itemref: "itemRef",
          itemscope: "itemScope",
          itemtype: "itemType",
          keyparams: "keyParams",
          keytype: "keyType",
          kind: "kind",
          label: "label",
          lang: "lang",
          list: "list",
          loop: "loop",
          low: "low",
          manifest: "manifest",
          marginwidth: "marginWidth",
          marginheight: "marginHeight",
          max: "max",
          maxlength: "maxLength",
          media: "media",
          mediagroup: "mediaGroup",
          method: "method",
          min: "min",
          minlength: "minLength",
          multiple: "multiple",
          muted: "muted",
          name: "name",
          nomodule: "noModule",
          nonce: "nonce",
          novalidate: "noValidate",
          open: "open",
          optimum: "optimum",
          pattern: "pattern",
          placeholder: "placeholder",
          playsinline: "playsInline",
          poster: "poster",
          preload: "preload",
          profile: "profile",
          radiogroup: "radioGroup",
          readonly: "readOnly",
          referrerpolicy: "referrerPolicy",
          rel: "rel",
          required: "required",
          reversed: "reversed",
          role: "role",
          rows: "rows",
          rowspan: "rowSpan",
          sandbox: "sandbox",
          scope: "scope",
          scoped: "scoped",
          scrolling: "scrolling",
          seamless: "seamless",
          selected: "selected",
          shape: "shape",
          size: "size",
          sizes: "sizes",
          span: "span",
          spellcheck: "spellCheck",
          src: "src",
          srcdoc: "srcDoc",
          srclang: "srcLang",
          srcset: "srcSet",
          start: "start",
          step: "step",
          style: "style",
          summary: "summary",
          tabindex: "tabIndex",
          target: "target",
          title: "title",
          type: "type",
          usemap: "useMap",
          value: "value",
          width: "width",
          wmode: "wmode",
          wrap: "wrap",
          // SVG
          about: "about",
          accentheight: "accentHeight",
          "accent-height": "accentHeight",
          accumulate: "accumulate",
          additive: "additive",
          alignmentbaseline: "alignmentBaseline",
          "alignment-baseline": "alignmentBaseline",
          allowreorder: "allowReorder",
          alphabetic: "alphabetic",
          amplitude: "amplitude",
          arabicform: "arabicForm",
          "arabic-form": "arabicForm",
          ascent: "ascent",
          attributename: "attributeName",
          attributetype: "attributeType",
          autoreverse: "autoReverse",
          azimuth: "azimuth",
          basefrequency: "baseFrequency",
          baselineshift: "baselineShift",
          "baseline-shift": "baselineShift",
          baseprofile: "baseProfile",
          bbox: "bbox",
          begin: "begin",
          bias: "bias",
          by: "by",
          calcmode: "calcMode",
          capheight: "capHeight",
          "cap-height": "capHeight",
          clip: "clip",
          clippath: "clipPath",
          "clip-path": "clipPath",
          clippathunits: "clipPathUnits",
          cliprule: "clipRule",
          "clip-rule": "clipRule",
          color: "color",
          colorinterpolation: "colorInterpolation",
          "color-interpolation": "colorInterpolation",
          colorinterpolationfilters: "colorInterpolationFilters",
          "color-interpolation-filters": "colorInterpolationFilters",
          colorprofile: "colorProfile",
          "color-profile": "colorProfile",
          colorrendering: "colorRendering",
          "color-rendering": "colorRendering",
          contentscripttype: "contentScriptType",
          contentstyletype: "contentStyleType",
          cursor: "cursor",
          cx: "cx",
          cy: "cy",
          d: "d",
          datatype: "datatype",
          decelerate: "decelerate",
          descent: "descent",
          diffuseconstant: "diffuseConstant",
          direction: "direction",
          display: "display",
          divisor: "divisor",
          dominantbaseline: "dominantBaseline",
          "dominant-baseline": "dominantBaseline",
          dur: "dur",
          dx: "dx",
          dy: "dy",
          edgemode: "edgeMode",
          elevation: "elevation",
          enablebackground: "enableBackground",
          "enable-background": "enableBackground",
          end: "end",
          exponent: "exponent",
          externalresourcesrequired: "externalResourcesRequired",
          fill: "fill",
          fillopacity: "fillOpacity",
          "fill-opacity": "fillOpacity",
          fillrule: "fillRule",
          "fill-rule": "fillRule",
          filter: "filter",
          filterres: "filterRes",
          filterunits: "filterUnits",
          floodopacity: "floodOpacity",
          "flood-opacity": "floodOpacity",
          floodcolor: "floodColor",
          "flood-color": "floodColor",
          focusable: "focusable",
          fontfamily: "fontFamily",
          "font-family": "fontFamily",
          fontsize: "fontSize",
          "font-size": "fontSize",
          fontsizeadjust: "fontSizeAdjust",
          "font-size-adjust": "fontSizeAdjust",
          fontstretch: "fontStretch",
          "font-stretch": "fontStretch",
          fontstyle: "fontStyle",
          "font-style": "fontStyle",
          fontvariant: "fontVariant",
          "font-variant": "fontVariant",
          fontweight: "fontWeight",
          "font-weight": "fontWeight",
          format: "format",
          from: "from",
          fx: "fx",
          fy: "fy",
          g1: "g1",
          g2: "g2",
          glyphname: "glyphName",
          "glyph-name": "glyphName",
          glyphorientationhorizontal: "glyphOrientationHorizontal",
          "glyph-orientation-horizontal": "glyphOrientationHorizontal",
          glyphorientationvertical: "glyphOrientationVertical",
          "glyph-orientation-vertical": "glyphOrientationVertical",
          glyphref: "glyphRef",
          gradienttransform: "gradientTransform",
          gradientunits: "gradientUnits",
          hanging: "hanging",
          horizadvx: "horizAdvX",
          "horiz-adv-x": "horizAdvX",
          horizoriginx: "horizOriginX",
          "horiz-origin-x": "horizOriginX",
          ideographic: "ideographic",
          imagerendering: "imageRendering",
          "image-rendering": "imageRendering",
          in2: "in2",
          in: "in",
          inlist: "inlist",
          intercept: "intercept",
          k1: "k1",
          k2: "k2",
          k3: "k3",
          k4: "k4",
          k: "k",
          kernelmatrix: "kernelMatrix",
          kernelunitlength: "kernelUnitLength",
          kerning: "kerning",
          keypoints: "keyPoints",
          keysplines: "keySplines",
          keytimes: "keyTimes",
          lengthadjust: "lengthAdjust",
          letterspacing: "letterSpacing",
          "letter-spacing": "letterSpacing",
          lightingcolor: "lightingColor",
          "lighting-color": "lightingColor",
          limitingconeangle: "limitingConeAngle",
          local: "local",
          markerend: "markerEnd",
          "marker-end": "markerEnd",
          markerheight: "markerHeight",
          markermid: "markerMid",
          "marker-mid": "markerMid",
          markerstart: "markerStart",
          "marker-start": "markerStart",
          markerunits: "markerUnits",
          markerwidth: "markerWidth",
          mask: "mask",
          maskcontentunits: "maskContentUnits",
          maskunits: "maskUnits",
          mathematical: "mathematical",
          mode: "mode",
          numoctaves: "numOctaves",
          offset: "offset",
          opacity: "opacity",
          operator: "operator",
          order: "order",
          orient: "orient",
          orientation: "orientation",
          origin: "origin",
          overflow: "overflow",
          overlineposition: "overlinePosition",
          "overline-position": "overlinePosition",
          overlinethickness: "overlineThickness",
          "overline-thickness": "overlineThickness",
          paintorder: "paintOrder",
          "paint-order": "paintOrder",
          panose1: "panose1",
          "panose-1": "panose1",
          pathlength: "pathLength",
          patterncontentunits: "patternContentUnits",
          patterntransform: "patternTransform",
          patternunits: "patternUnits",
          pointerevents: "pointerEvents",
          "pointer-events": "pointerEvents",
          points: "points",
          pointsatx: "pointsAtX",
          pointsaty: "pointsAtY",
          pointsatz: "pointsAtZ",
          prefix: "prefix",
          preservealpha: "preserveAlpha",
          preserveaspectratio: "preserveAspectRatio",
          primitiveunits: "primitiveUnits",
          property: "property",
          r: "r",
          radius: "radius",
          refx: "refX",
          refy: "refY",
          renderingintent: "renderingIntent",
          "rendering-intent": "renderingIntent",
          repeatcount: "repeatCount",
          repeatdur: "repeatDur",
          requiredextensions: "requiredExtensions",
          requiredfeatures: "requiredFeatures",
          resource: "resource",
          restart: "restart",
          result: "result",
          results: "results",
          rotate: "rotate",
          rx: "rx",
          ry: "ry",
          scale: "scale",
          security: "security",
          seed: "seed",
          shaperendering: "shapeRendering",
          "shape-rendering": "shapeRendering",
          slope: "slope",
          spacing: "spacing",
          specularconstant: "specularConstant",
          specularexponent: "specularExponent",
          speed: "speed",
          spreadmethod: "spreadMethod",
          startoffset: "startOffset",
          stddeviation: "stdDeviation",
          stemh: "stemh",
          stemv: "stemv",
          stitchtiles: "stitchTiles",
          stopcolor: "stopColor",
          "stop-color": "stopColor",
          stopopacity: "stopOpacity",
          "stop-opacity": "stopOpacity",
          strikethroughposition: "strikethroughPosition",
          "strikethrough-position": "strikethroughPosition",
          strikethroughthickness: "strikethroughThickness",
          "strikethrough-thickness": "strikethroughThickness",
          string: "string",
          stroke: "stroke",
          strokedasharray: "strokeDasharray",
          "stroke-dasharray": "strokeDasharray",
          strokedashoffset: "strokeDashoffset",
          "stroke-dashoffset": "strokeDashoffset",
          strokelinecap: "strokeLinecap",
          "stroke-linecap": "strokeLinecap",
          strokelinejoin: "strokeLinejoin",
          "stroke-linejoin": "strokeLinejoin",
          strokemiterlimit: "strokeMiterlimit",
          "stroke-miterlimit": "strokeMiterlimit",
          strokewidth: "strokeWidth",
          "stroke-width": "strokeWidth",
          strokeopacity: "strokeOpacity",
          "stroke-opacity": "strokeOpacity",
          suppresscontenteditablewarning: "suppressContentEditableWarning",
          suppresshydrationwarning: "suppressHydrationWarning",
          surfacescale: "surfaceScale",
          systemlanguage: "systemLanguage",
          tablevalues: "tableValues",
          targetx: "targetX",
          targety: "targetY",
          textanchor: "textAnchor",
          "text-anchor": "textAnchor",
          textdecoration: "textDecoration",
          "text-decoration": "textDecoration",
          textlength: "textLength",
          textrendering: "textRendering",
          "text-rendering": "textRendering",
          to: "to",
          transform: "transform",
          typeof: "typeof",
          u1: "u1",
          u2: "u2",
          underlineposition: "underlinePosition",
          "underline-position": "underlinePosition",
          underlinethickness: "underlineThickness",
          "underline-thickness": "underlineThickness",
          unicode: "unicode",
          unicodebidi: "unicodeBidi",
          "unicode-bidi": "unicodeBidi",
          unicoderange: "unicodeRange",
          "unicode-range": "unicodeRange",
          unitsperem: "unitsPerEm",
          "units-per-em": "unitsPerEm",
          unselectable: "unselectable",
          valphabetic: "vAlphabetic",
          "v-alphabetic": "vAlphabetic",
          values: "values",
          vectoreffect: "vectorEffect",
          "vector-effect": "vectorEffect",
          version: "version",
          vertadvy: "vertAdvY",
          "vert-adv-y": "vertAdvY",
          vertoriginx: "vertOriginX",
          "vert-origin-x": "vertOriginX",
          vertoriginy: "vertOriginY",
          "vert-origin-y": "vertOriginY",
          vhanging: "vHanging",
          "v-hanging": "vHanging",
          videographic: "vIdeographic",
          "v-ideographic": "vIdeographic",
          viewbox: "viewBox",
          viewtarget: "viewTarget",
          visibility: "visibility",
          vmathematical: "vMathematical",
          "v-mathematical": "vMathematical",
          vocab: "vocab",
          widths: "widths",
          wordspacing: "wordSpacing",
          "word-spacing": "wordSpacing",
          writingmode: "writingMode",
          "writing-mode": "writingMode",
          x1: "x1",
          x2: "x2",
          x: "x",
          xchannelselector: "xChannelSelector",
          xheight: "xHeight",
          "x-height": "xHeight",
          xlinkactuate: "xlinkActuate",
          "xlink:actuate": "xlinkActuate",
          xlinkarcrole: "xlinkArcrole",
          "xlink:arcrole": "xlinkArcrole",
          xlinkhref: "xlinkHref",
          "xlink:href": "xlinkHref",
          xlinkrole: "xlinkRole",
          "xlink:role": "xlinkRole",
          xlinkshow: "xlinkShow",
          "xlink:show": "xlinkShow",
          xlinktitle: "xlinkTitle",
          "xlink:title": "xlinkTitle",
          xlinktype: "xlinkType",
          "xlink:type": "xlinkType",
          xmlbase: "xmlBase",
          "xml:base": "xmlBase",
          xmllang: "xmlLang",
          "xml:lang": "xmlLang",
          xmlns: "xmlns",
          "xml:space": "xmlSpace",
          xmlnsxlink: "xmlnsXlink",
          "xmlns:xlink": "xmlnsXlink",
          xmlspace: "xmlSpace",
          y1: "y1",
          y2: "y2",
          y: "y",
          ychannelselector: "yChannelSelector",
          z: "z",
          zoomandpan: "zoomAndPan"
        };
        var validateProperty$1 = function() {
        };
        {
          var warnedProperties$1 = {};
          var EVENT_NAME_REGEX = /^on./;
          var INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/;
          var rARIA$1 = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
          var rARIACamel$1 = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
          validateProperty$1 = function(tagName, name, value, eventRegistry) {
            if (hasOwnProperty.call(warnedProperties$1, name) && warnedProperties$1[name]) {
              return true;
            }
            var lowerCasedName = name.toLowerCase();
            if (lowerCasedName === "onfocusin" || lowerCasedName === "onfocusout") {
              error("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React.");
              warnedProperties$1[name] = true;
              return true;
            }
            if (eventRegistry != null) {
              var registrationNameDependencies = eventRegistry.registrationNameDependencies, possibleRegistrationNames = eventRegistry.possibleRegistrationNames;
              if (registrationNameDependencies.hasOwnProperty(name)) {
                return true;
              }
              var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
              if (registrationName != null) {
                error("Invalid event handler property `%s`. Did you mean `%s`?", name, registrationName);
                warnedProperties$1[name] = true;
                return true;
              }
              if (EVENT_NAME_REGEX.test(name)) {
                error("Unknown event handler property `%s`. It will be ignored.", name);
                warnedProperties$1[name] = true;
                return true;
              }
            } else if (EVENT_NAME_REGEX.test(name)) {
              if (INVALID_EVENT_NAME_REGEX.test(name)) {
                error("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", name);
              }
              warnedProperties$1[name] = true;
              return true;
            }
            if (rARIA$1.test(name) || rARIACamel$1.test(name)) {
              return true;
            }
            if (lowerCasedName === "innerhtml") {
              error("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`.");
              warnedProperties$1[name] = true;
              return true;
            }
            if (lowerCasedName === "aria") {
              error("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead.");
              warnedProperties$1[name] = true;
              return true;
            }
            if (lowerCasedName === "is" && value !== null && value !== void 0 && typeof value !== "string") {
              error("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof value);
              warnedProperties$1[name] = true;
              return true;
            }
            if (typeof value === "number" && isNaN(value)) {
              error("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", name);
              warnedProperties$1[name] = true;
              return true;
            }
            var propertyInfo = getPropertyInfo(name);
            var isReserved = propertyInfo !== null && propertyInfo.type === RESERVED;
            if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
              var standardName = possibleStandardNames[lowerCasedName];
              if (standardName !== name) {
                error("Invalid DOM property `%s`. Did you mean `%s`?", name, standardName);
                warnedProperties$1[name] = true;
                return true;
              }
            } else if (!isReserved && name !== lowerCasedName) {
              error("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", name, lowerCasedName);
              warnedProperties$1[name] = true;
              return true;
            }
            if (typeof value === "boolean" && shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
              if (value) {
                error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', value, name, name, value, name);
              } else {
                error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', value, name, name, value, name, name, name);
              }
              warnedProperties$1[name] = true;
              return true;
            }
            if (isReserved) {
              return true;
            }
            if (shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
              warnedProperties$1[name] = true;
              return false;
            }
            if ((value === "false" || value === "true") && propertyInfo !== null && propertyInfo.type === BOOLEAN) {
              error("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", value, name, value === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', name, value);
              warnedProperties$1[name] = true;
              return true;
            }
            return true;
          };
        }
        var warnUnknownProperties = function(type, props, eventRegistry) {
          {
            var unknownProps = [];
            for (var key in props) {
              var isValid = validateProperty$1(type, key, props[key], eventRegistry);
              if (!isValid) {
                unknownProps.push(key);
              }
            }
            var unknownPropString = unknownProps.map(function(prop) {
              return "`" + prop + "`";
            }).join(", ");
            if (unknownProps.length === 1) {
              error("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
            } else if (unknownProps.length > 1) {
              error("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
            }
          }
        };
        function validateProperties$2(type, props, eventRegistry) {
          if (isCustomComponent(type, props)) {
            return;
          }
          warnUnknownProperties(type, props, eventRegistry);
        }
        var warnValidStyle = function() {
        };
        {
          var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
          var msPattern = /^-ms-/;
          var hyphenPattern = /-(.)/g;
          var badStyleValueWithSemicolonPattern = /;\s*$/;
          var warnedStyleNames = {};
          var warnedStyleValues = {};
          var warnedForNaNValue = false;
          var warnedForInfinityValue = false;
          var camelize = function(string) {
            return string.replace(hyphenPattern, function(_, character) {
              return character.toUpperCase();
            });
          };
          var warnHyphenatedStyleName = function(name) {
            if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
              return;
            }
            warnedStyleNames[name] = true;
            error(
              "Unsupported style property %s. Did you mean %s?",
              name,
              // As Andi Smith suggests
              // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
              // is converted to lowercase `ms`.
              camelize(name.replace(msPattern, "ms-"))
            );
          };
          var warnBadVendoredStyleName = function(name) {
            if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
              return;
            }
            warnedStyleNames[name] = true;
            error("Unsupported vendor-prefixed style property %s. Did you mean %s?", name, name.charAt(0).toUpperCase() + name.slice(1));
          };
          var warnStyleValueWithSemicolon = function(name, value) {
            if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
              return;
            }
            warnedStyleValues[value] = true;
            error(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, name, value.replace(badStyleValueWithSemicolonPattern, ""));
          };
          var warnStyleValueIsNaN = function(name, value) {
            if (warnedForNaNValue) {
              return;
            }
            warnedForNaNValue = true;
            error("`NaN` is an invalid value for the `%s` css style property.", name);
          };
          var warnStyleValueIsInfinity = function(name, value) {
            if (warnedForInfinityValue) {
              return;
            }
            warnedForInfinityValue = true;
            error("`Infinity` is an invalid value for the `%s` css style property.", name);
          };
          warnValidStyle = function(name, value) {
            if (name.indexOf("-") > -1) {
              warnHyphenatedStyleName(name);
            } else if (badVendoredStyleNamePattern.test(name)) {
              warnBadVendoredStyleName(name);
            } else if (badStyleValueWithSemicolonPattern.test(value)) {
              warnStyleValueWithSemicolon(name, value);
            }
            if (typeof value === "number") {
              if (isNaN(value)) {
                warnStyleValueIsNaN(name, value);
              } else if (!isFinite(value)) {
                warnStyleValueIsInfinity(name, value);
              }
            }
          };
        }
        var warnValidStyle$1 = warnValidStyle;
        var matchHtmlRegExp = /["'&<>]/;
        function escapeHtml(string) {
          {
            checkHtmlStringCoercion(string);
          }
          var str = "" + string;
          var match = matchHtmlRegExp.exec(str);
          if (!match) {
            return str;
          }
          var escape;
          var html = "";
          var index;
          var lastIndex = 0;
          for (index = match.index; index < str.length; index++) {
            switch (str.charCodeAt(index)) {
              case 34:
                escape = "&quot;";
                break;
              case 38:
                escape = "&amp;";
                break;
              case 39:
                escape = "&#x27;";
                break;
              case 60:
                escape = "&lt;";
                break;
              case 62:
                escape = "&gt;";
                break;
              default:
                continue;
            }
            if (lastIndex !== index) {
              html += str.substring(lastIndex, index);
            }
            lastIndex = index + 1;
            html += escape;
          }
          return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
        }
        function escapeTextForBrowser(text) {
          if (typeof text === "boolean" || typeof text === "number") {
            return "" + text;
          }
          return escapeHtml(text);
        }
        var uppercasePattern = /([A-Z])/g;
        var msPattern$1 = /^ms-/;
        function hyphenateStyleName(name) {
          return name.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern$1, "-ms-");
        }
        var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;
        var didWarn = false;
        function sanitizeURL(url) {
          {
            if (!didWarn && isJavaScriptProtocol.test(url)) {
              didWarn = true;
              error("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(url));
            }
          }
        }
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        var startInlineScript = stringToPrecomputedChunk("<script>");
        var endInlineScript = stringToPrecomputedChunk("<\/script>");
        var startScriptSrc = stringToPrecomputedChunk('<script src="');
        var startModuleSrc = stringToPrecomputedChunk('<script type="module" src="');
        var endAsyncScript = stringToPrecomputedChunk('" async=""><\/script>');
        function escapeBootstrapScriptContent(scriptText) {
          {
            checkHtmlStringCoercion(scriptText);
          }
          return ("" + scriptText).replace(scriptRegex, scriptReplacer);
        }
        var scriptRegex = /(<\/|<)(s)(cript)/gi;
        var scriptReplacer = function(match, prefix2, s, suffix) {
          return "" + prefix2 + (s === "s" ? "\\u0073" : "\\u0053") + suffix;
        };
        function createResponseState(identifierPrefix, nonce, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
          var idPrefix = identifierPrefix === void 0 ? "" : identifierPrefix;
          var inlineScriptWithNonce = nonce === void 0 ? startInlineScript : stringToPrecomputedChunk('<script nonce="' + escapeTextForBrowser(nonce) + '">');
          var bootstrapChunks = [];
          if (bootstrapScriptContent !== void 0) {
            bootstrapChunks.push(inlineScriptWithNonce, stringToChunk(escapeBootstrapScriptContent(bootstrapScriptContent)), endInlineScript);
          }
          if (bootstrapScripts !== void 0) {
            for (var i = 0; i < bootstrapScripts.length; i++) {
              bootstrapChunks.push(startScriptSrc, stringToChunk(escapeTextForBrowser(bootstrapScripts[i])), endAsyncScript);
            }
          }
          if (bootstrapModules !== void 0) {
            for (var _i = 0; _i < bootstrapModules.length; _i++) {
              bootstrapChunks.push(startModuleSrc, stringToChunk(escapeTextForBrowser(bootstrapModules[_i])), endAsyncScript);
            }
          }
          return {
            bootstrapChunks,
            startInlineScript: inlineScriptWithNonce,
            placeholderPrefix: stringToPrecomputedChunk(idPrefix + "P:"),
            segmentPrefix: stringToPrecomputedChunk(idPrefix + "S:"),
            boundaryPrefix: idPrefix + "B:",
            idPrefix,
            nextSuspenseID: 0,
            sentCompleteSegmentFunction: false,
            sentCompleteBoundaryFunction: false,
            sentClientRenderFunction: false
          };
        }
        var ROOT_HTML_MODE = 0;
        var HTML_MODE = 1;
        var SVG_MODE = 2;
        var MATHML_MODE = 3;
        var HTML_TABLE_MODE = 4;
        var HTML_TABLE_BODY_MODE = 5;
        var HTML_TABLE_ROW_MODE = 6;
        var HTML_COLGROUP_MODE = 7;
        function createFormatContext(insertionMode, selectedValue) {
          return {
            insertionMode,
            selectedValue
          };
        }
        function getChildFormatContext(parentContext, type, props) {
          switch (type) {
            case "select":
              return createFormatContext(HTML_MODE, props.value != null ? props.value : props.defaultValue);
            case "svg":
              return createFormatContext(SVG_MODE, null);
            case "math":
              return createFormatContext(MATHML_MODE, null);
            case "foreignObject":
              return createFormatContext(HTML_MODE, null);
            case "table":
              return createFormatContext(HTML_TABLE_MODE, null);
            case "thead":
            case "tbody":
            case "tfoot":
              return createFormatContext(HTML_TABLE_BODY_MODE, null);
            case "colgroup":
              return createFormatContext(HTML_COLGROUP_MODE, null);
            case "tr":
              return createFormatContext(HTML_TABLE_ROW_MODE, null);
          }
          if (parentContext.insertionMode >= HTML_TABLE_MODE) {
            return createFormatContext(HTML_MODE, null);
          }
          if (parentContext.insertionMode === ROOT_HTML_MODE) {
            return createFormatContext(HTML_MODE, null);
          }
          return parentContext;
        }
        var UNINITIALIZED_SUSPENSE_BOUNDARY_ID = null;
        function assignSuspenseBoundaryID(responseState) {
          var generatedID = responseState.nextSuspenseID++;
          return stringToPrecomputedChunk(responseState.boundaryPrefix + generatedID.toString(16));
        }
        function makeId(responseState, treeId, localId) {
          var idPrefix = responseState.idPrefix;
          var id = ":" + idPrefix + "R" + treeId;
          if (localId > 0) {
            id += "H" + localId.toString(32);
          }
          return id + ":";
        }
        function encodeHTMLTextNode(text) {
          return escapeTextForBrowser(text);
        }
        var textSeparator = stringToPrecomputedChunk("<!-- -->");
        function pushTextInstance(target, text, responseState, textEmbedded) {
          if (text === "") {
            return textEmbedded;
          }
          if (textEmbedded) {
            target.push(textSeparator);
          }
          target.push(stringToChunk(encodeHTMLTextNode(text)));
          return true;
        }
        function pushSegmentFinale(target, responseState, lastPushedText, textEmbedded) {
          if (lastPushedText && textEmbedded) {
            target.push(textSeparator);
          }
        }
        var styleNameCache = /* @__PURE__ */ new Map();
        function processStyleName(styleName) {
          var chunk = styleNameCache.get(styleName);
          if (chunk !== void 0) {
            return chunk;
          }
          var result = stringToPrecomputedChunk(escapeTextForBrowser(hyphenateStyleName(styleName)));
          styleNameCache.set(styleName, result);
          return result;
        }
        var styleAttributeStart = stringToPrecomputedChunk(' style="');
        var styleAssign = stringToPrecomputedChunk(":");
        var styleSeparator = stringToPrecomputedChunk(";");
        function pushStyle(target, responseState, style) {
          if (typeof style !== "object") {
            throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
          }
          var isFirst = true;
          for (var styleName in style) {
            if (!hasOwnProperty.call(style, styleName)) {
              continue;
            }
            var styleValue = style[styleName];
            if (styleValue == null || typeof styleValue === "boolean" || styleValue === "") {
              continue;
            }
            var nameChunk = void 0;
            var valueChunk = void 0;
            var isCustomProperty = styleName.indexOf("--") === 0;
            if (isCustomProperty) {
              nameChunk = stringToChunk(escapeTextForBrowser(styleName));
              {
                checkCSSPropertyStringCoercion(styleValue, styleName);
              }
              valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
            } else {
              {
                warnValidStyle$1(styleName, styleValue);
              }
              nameChunk = processStyleName(styleName);
              if (typeof styleValue === "number") {
                if (styleValue !== 0 && !hasOwnProperty.call(isUnitlessNumber, styleName)) {
                  valueChunk = stringToChunk(styleValue + "px");
                } else {
                  valueChunk = stringToChunk("" + styleValue);
                }
              } else {
                {
                  checkCSSPropertyStringCoercion(styleValue, styleName);
                }
                valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
              }
            }
            if (isFirst) {
              isFirst = false;
              target.push(styleAttributeStart, nameChunk, styleAssign, valueChunk);
            } else {
              target.push(styleSeparator, nameChunk, styleAssign, valueChunk);
            }
          }
          if (!isFirst) {
            target.push(attributeEnd);
          }
        }
        var attributeSeparator = stringToPrecomputedChunk(" ");
        var attributeAssign = stringToPrecomputedChunk('="');
        var attributeEnd = stringToPrecomputedChunk('"');
        var attributeEmptyString = stringToPrecomputedChunk('=""');
        function pushAttribute(target, responseState, name, value) {
          switch (name) {
            case "style": {
              pushStyle(target, responseState, value);
              return;
            }
            case "defaultValue":
            case "defaultChecked":
            case "innerHTML":
            case "suppressContentEditableWarning":
            case "suppressHydrationWarning":
              return;
          }
          if (
            // shouldIgnoreAttribute
            // We have already filtered out null/undefined and reserved words.
            name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N")
          ) {
            return;
          }
          var propertyInfo = getPropertyInfo(name);
          if (propertyInfo !== null) {
            switch (typeof value) {
              case "function":
              case "symbol":
                return;
              case "boolean": {
                if (!propertyInfo.acceptsBooleans) {
                  return;
                }
              }
            }
            var attributeName = propertyInfo.attributeName;
            var attributeNameChunk = stringToChunk(attributeName);
            switch (propertyInfo.type) {
              case BOOLEAN:
                if (value) {
                  target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
                }
                return;
              case OVERLOADED_BOOLEAN:
                if (value === true) {
                  target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
                } else if (value === false) ;
                else {
                  target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                }
                return;
              case NUMERIC:
                if (!isNaN(value)) {
                  target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                }
                break;
              case POSITIVE_NUMERIC:
                if (!isNaN(value) && value >= 1) {
                  target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                }
                break;
              default:
                if (propertyInfo.sanitizeURL) {
                  {
                    checkAttributeStringCoercion(value, attributeName);
                  }
                  value = "" + value;
                  sanitizeURL(value);
                }
                target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
            }
          } else if (isAttributeNameSafe(name)) {
            switch (typeof value) {
              case "function":
              case "symbol":
                return;
              case "boolean": {
                var prefix2 = name.toLowerCase().slice(0, 5);
                if (prefix2 !== "data-" && prefix2 !== "aria-") {
                  return;
                }
              }
            }
            target.push(attributeSeparator, stringToChunk(name), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
          }
        }
        var endOfStartTag = stringToPrecomputedChunk(">");
        var endOfStartTagSelfClosing = stringToPrecomputedChunk("/>");
        function pushInnerHTML(target, innerHTML, children) {
          if (innerHTML != null) {
            if (children != null) {
              throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
            }
            if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
              throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
            }
            var html = innerHTML.__html;
            if (html !== null && html !== void 0) {
              {
                checkHtmlStringCoercion(html);
              }
              target.push(stringToChunk("" + html));
            }
          }
        }
        var didWarnDefaultInputValue = false;
        var didWarnDefaultChecked = false;
        var didWarnDefaultSelectValue = false;
        var didWarnDefaultTextareaValue = false;
        var didWarnInvalidOptionChildren = false;
        var didWarnInvalidOptionInnerHTML = false;
        var didWarnSelectedSetOnOption = false;
        function checkSelectProp(props, propName) {
          {
            var value = props[propName];
            if (value != null) {
              var array = isArray(value);
              if (props.multiple && !array) {
                error("The `%s` prop supplied to <select> must be an array if `multiple` is true.", propName);
              } else if (!props.multiple && array) {
                error("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.", propName);
              }
            }
          }
        }
        function pushStartSelect(target, props, responseState) {
          {
            checkControlledValueProps("select", props);
            checkSelectProp(props, "value");
            checkSelectProp(props, "defaultValue");
            if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultSelectValue) {
              error("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components");
              didWarnDefaultSelectValue = true;
            }
          }
          target.push(startChunkForTag("select"));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "defaultValue":
                case "value":
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          return children;
        }
        function flattenOptionChildren(children) {
          var content = "";
          React.Children.forEach(children, function(child) {
            if (child == null) {
              return;
            }
            content += child;
            {
              if (!didWarnInvalidOptionChildren && typeof child !== "string" && typeof child !== "number") {
                didWarnInvalidOptionChildren = true;
                error("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.");
              }
            }
          });
          return content;
        }
        var selectedMarkerAttribute = stringToPrecomputedChunk(' selected=""');
        function pushStartOption(target, props, responseState, formatContext) {
          var selectedValue = formatContext.selectedValue;
          target.push(startChunkForTag("option"));
          var children = null;
          var value = null;
          var selected = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "selected":
                  selected = propValue;
                  {
                    if (!didWarnSelectedSetOnOption) {
                      error("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>.");
                      didWarnSelectedSetOnOption = true;
                    }
                  }
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "value":
                  value = propValue;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          if (selectedValue != null) {
            var stringValue;
            if (value !== null) {
              {
                checkAttributeStringCoercion(value, "value");
              }
              stringValue = "" + value;
            } else {
              {
                if (innerHTML !== null) {
                  if (!didWarnInvalidOptionInnerHTML) {
                    didWarnInvalidOptionInnerHTML = true;
                    error("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.");
                  }
                }
              }
              stringValue = flattenOptionChildren(children);
            }
            if (isArray(selectedValue)) {
              for (var i = 0; i < selectedValue.length; i++) {
                {
                  checkAttributeStringCoercion(selectedValue[i], "value");
                }
                var v = "" + selectedValue[i];
                if (v === stringValue) {
                  target.push(selectedMarkerAttribute);
                  break;
                }
              }
            } else {
              {
                checkAttributeStringCoercion(selectedValue, "select.value");
              }
              if ("" + selectedValue === stringValue) {
                target.push(selectedMarkerAttribute);
              }
            }
          } else if (selected) {
            target.push(selectedMarkerAttribute);
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          return children;
        }
        function pushInput(target, props, responseState) {
          {
            checkControlledValueProps("input", props);
            if (props.checked !== void 0 && props.defaultChecked !== void 0 && !didWarnDefaultChecked) {
              error("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
              didWarnDefaultChecked = true;
            }
            if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultInputValue) {
              error("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
              didWarnDefaultInputValue = true;
            }
          }
          target.push(startChunkForTag("input"));
          var value = null;
          var defaultValue = null;
          var checked = null;
          var defaultChecked = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw new Error("input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
                case "defaultChecked":
                  defaultChecked = propValue;
                  break;
                case "defaultValue":
                  defaultValue = propValue;
                  break;
                case "checked":
                  checked = propValue;
                  break;
                case "value":
                  value = propValue;
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          if (checked !== null) {
            pushAttribute(target, responseState, "checked", checked);
          } else if (defaultChecked !== null) {
            pushAttribute(target, responseState, "checked", defaultChecked);
          }
          if (value !== null) {
            pushAttribute(target, responseState, "value", value);
          } else if (defaultValue !== null) {
            pushAttribute(target, responseState, "value", defaultValue);
          }
          target.push(endOfStartTagSelfClosing);
          return null;
        }
        function pushStartTextArea(target, props, responseState) {
          {
            checkControlledValueProps("textarea", props);
            if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultTextareaValue) {
              error("Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components");
              didWarnDefaultTextareaValue = true;
            }
          }
          target.push(startChunkForTag("textarea"));
          var value = null;
          var defaultValue = null;
          var children = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "value":
                  value = propValue;
                  break;
                case "defaultValue":
                  defaultValue = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          if (value === null && defaultValue !== null) {
            value = defaultValue;
          }
          target.push(endOfStartTag);
          if (children != null) {
            {
              error("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
            }
            if (value != null) {
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            }
            if (isArray(children)) {
              if (children.length > 1) {
                throw new Error("<textarea> can only have at most one child.");
              }
              {
                checkHtmlStringCoercion(children[0]);
              }
              value = "" + children[0];
            }
            {
              checkHtmlStringCoercion(children);
            }
            value = "" + children;
          }
          if (typeof value === "string" && value[0] === "\n") {
            target.push(leadingNewline);
          }
          if (value !== null) {
            {
              checkAttributeStringCoercion(value, "value");
            }
            target.push(stringToChunk(encodeHTMLTextNode("" + value)));
          }
          return null;
        }
        function pushSelfClosing(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw new Error(tag + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTagSelfClosing);
          return null;
        }
        function pushStartMenuItem(target, props, responseState) {
          target.push(startChunkForTag("menuitem"));
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw new Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          return null;
        }
        function pushStartTitle(target, props, responseState) {
          target.push(startChunkForTag("title"));
          var children = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  throw new Error("`dangerouslySetInnerHTML` does not make sense on <title>.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          {
            var child = Array.isArray(children) && children.length < 2 ? children[0] || null : children;
            if (Array.isArray(children) && children.length > 1) {
              error("A title element received an array with more than 1 element as children. In browsers title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
            } else if (child != null && child.$$typeof != null) {
              error("A title element received a React element for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
            } else if (child != null && typeof child !== "string" && typeof child !== "number") {
              error("A title element received a value that was not a string or number for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
            }
          }
          return children;
        }
        function pushStartGenericElement(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          if (typeof children === "string") {
            target.push(stringToChunk(encodeHTMLTextNode(children)));
            return null;
          }
          return children;
        }
        function pushStartCustomElement(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "style":
                  pushStyle(target, responseState, propValue);
                  break;
                case "suppressContentEditableWarning":
                case "suppressHydrationWarning":
                  break;
                default:
                  if (isAttributeNameSafe(propKey) && typeof propValue !== "function" && typeof propValue !== "symbol") {
                    target.push(attributeSeparator, stringToChunk(propKey), attributeAssign, stringToChunk(escapeTextForBrowser(propValue)), attributeEnd);
                  }
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          return children;
        }
        var leadingNewline = stringToPrecomputedChunk("\n");
        function pushStartPreformattedElement(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          if (innerHTML != null) {
            if (children != null) {
              throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
            }
            if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
              throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
            }
            var html = innerHTML.__html;
            if (html !== null && html !== void 0) {
              if (typeof html === "string" && html.length > 0 && html[0] === "\n") {
                target.push(leadingNewline, stringToChunk(html));
              } else {
                {
                  checkHtmlStringCoercion(html);
                }
                target.push(stringToChunk("" + html));
              }
            }
          }
          if (typeof children === "string" && children[0] === "\n") {
            target.push(leadingNewline);
          }
          return children;
        }
        var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
        var validatedTagCache = /* @__PURE__ */ new Map();
        function startChunkForTag(tag) {
          var tagStartChunk = validatedTagCache.get(tag);
          if (tagStartChunk === void 0) {
            if (!VALID_TAG_REGEX.test(tag)) {
              throw new Error("Invalid tag: " + tag);
            }
            tagStartChunk = stringToPrecomputedChunk("<" + tag);
            validatedTagCache.set(tag, tagStartChunk);
          }
          return tagStartChunk;
        }
        var DOCTYPE = stringToPrecomputedChunk("<!DOCTYPE html>");
        function pushStartInstance(target, type, props, responseState, formatContext) {
          {
            validateProperties(type, props);
            validateProperties$1(type, props);
            validateProperties$2(type, props, null);
            if (!props.suppressContentEditableWarning && props.contentEditable && props.children != null) {
              error("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional.");
            }
            if (formatContext.insertionMode !== SVG_MODE && formatContext.insertionMode !== MATHML_MODE) {
              if (type.indexOf("-") === -1 && typeof props.is !== "string" && type.toLowerCase() !== type) {
                error("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", type);
              }
            }
          }
          switch (type) {
            case "select":
              return pushStartSelect(target, props, responseState);
            case "option":
              return pushStartOption(target, props, responseState, formatContext);
            case "textarea":
              return pushStartTextArea(target, props, responseState);
            case "input":
              return pushInput(target, props, responseState);
            case "menuitem":
              return pushStartMenuItem(target, props, responseState);
            case "title":
              return pushStartTitle(target, props, responseState);
            case "listing":
            case "pre": {
              return pushStartPreformattedElement(target, props, type, responseState);
            }
            case "area":
            case "base":
            case "br":
            case "col":
            case "embed":
            case "hr":
            case "img":
            case "keygen":
            case "link":
            case "meta":
            case "param":
            case "source":
            case "track":
            case "wbr": {
              return pushSelfClosing(target, props, type, responseState);
            }
            case "annotation-xml":
            case "color-profile":
            case "font-face":
            case "font-face-src":
            case "font-face-uri":
            case "font-face-format":
            case "font-face-name":
            case "missing-glyph": {
              return pushStartGenericElement(target, props, type, responseState);
            }
            case "html": {
              if (formatContext.insertionMode === ROOT_HTML_MODE) {
                target.push(DOCTYPE);
              }
              return pushStartGenericElement(target, props, type, responseState);
            }
            default: {
              if (type.indexOf("-") === -1 && typeof props.is !== "string") {
                return pushStartGenericElement(target, props, type, responseState);
              } else {
                return pushStartCustomElement(target, props, type, responseState);
              }
            }
          }
        }
        var endTag1 = stringToPrecomputedChunk("</");
        var endTag2 = stringToPrecomputedChunk(">");
        function pushEndInstance(target, type, props) {
          switch (type) {
            case "area":
            case "base":
            case "br":
            case "col":
            case "embed":
            case "hr":
            case "img":
            case "input":
            case "keygen":
            case "link":
            case "meta":
            case "param":
            case "source":
            case "track":
            case "wbr": {
              break;
            }
            default: {
              target.push(endTag1, stringToChunk(type), endTag2);
            }
          }
        }
        function writeCompletedRoot(destination, responseState) {
          var bootstrapChunks = responseState.bootstrapChunks;
          var i = 0;
          for (; i < bootstrapChunks.length - 1; i++) {
            writeChunk(destination, bootstrapChunks[i]);
          }
          if (i < bootstrapChunks.length) {
            return writeChunkAndReturn(destination, bootstrapChunks[i]);
          }
          return true;
        }
        var placeholder1 = stringToPrecomputedChunk('<template id="');
        var placeholder2 = stringToPrecomputedChunk('"></template>');
        function writePlaceholder(destination, responseState, id) {
          writeChunk(destination, placeholder1);
          writeChunk(destination, responseState.placeholderPrefix);
          var formattedID = stringToChunk(id.toString(16));
          writeChunk(destination, formattedID);
          return writeChunkAndReturn(destination, placeholder2);
        }
        var startCompletedSuspenseBoundary = stringToPrecomputedChunk("<!--$-->");
        var startPendingSuspenseBoundary1 = stringToPrecomputedChunk('<!--$?--><template id="');
        var startPendingSuspenseBoundary2 = stringToPrecomputedChunk('"></template>');
        var startClientRenderedSuspenseBoundary = stringToPrecomputedChunk("<!--$!-->");
        var endSuspenseBoundary = stringToPrecomputedChunk("<!--/$-->");
        var clientRenderedSuspenseBoundaryError1 = stringToPrecomputedChunk("<template");
        var clientRenderedSuspenseBoundaryErrorAttrInterstitial = stringToPrecomputedChunk('"');
        var clientRenderedSuspenseBoundaryError1A = stringToPrecomputedChunk(' data-dgst="');
        var clientRenderedSuspenseBoundaryError1B = stringToPrecomputedChunk(' data-msg="');
        var clientRenderedSuspenseBoundaryError1C = stringToPrecomputedChunk(' data-stck="');
        var clientRenderedSuspenseBoundaryError2 = stringToPrecomputedChunk("></template>");
        function writeStartCompletedSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, startCompletedSuspenseBoundary);
        }
        function writeStartPendingSuspenseBoundary(destination, responseState, id) {
          writeChunk(destination, startPendingSuspenseBoundary1);
          if (id === null) {
            throw new Error("An ID must have been assigned before we can complete the boundary.");
          }
          writeChunk(destination, id);
          return writeChunkAndReturn(destination, startPendingSuspenseBoundary2);
        }
        function writeStartClientRenderedSuspenseBoundary(destination, responseState, errorDigest, errorMesssage, errorComponentStack) {
          var result;
          result = writeChunkAndReturn(destination, startClientRenderedSuspenseBoundary);
          writeChunk(destination, clientRenderedSuspenseBoundaryError1);
          if (errorDigest) {
            writeChunk(destination, clientRenderedSuspenseBoundaryError1A);
            writeChunk(destination, stringToChunk(escapeTextForBrowser(errorDigest)));
            writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
          }
          {
            if (errorMesssage) {
              writeChunk(destination, clientRenderedSuspenseBoundaryError1B);
              writeChunk(destination, stringToChunk(escapeTextForBrowser(errorMesssage)));
              writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
            }
            if (errorComponentStack) {
              writeChunk(destination, clientRenderedSuspenseBoundaryError1C);
              writeChunk(destination, stringToChunk(escapeTextForBrowser(errorComponentStack)));
              writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
            }
          }
          result = writeChunkAndReturn(destination, clientRenderedSuspenseBoundaryError2);
          return result;
        }
        function writeEndCompletedSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, endSuspenseBoundary);
        }
        function writeEndPendingSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, endSuspenseBoundary);
        }
        function writeEndClientRenderedSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, endSuspenseBoundary);
        }
        var startSegmentHTML = stringToPrecomputedChunk('<div hidden id="');
        var startSegmentHTML2 = stringToPrecomputedChunk('">');
        var endSegmentHTML = stringToPrecomputedChunk("</div>");
        var startSegmentSVG = stringToPrecomputedChunk('<svg aria-hidden="true" style="display:none" id="');
        var startSegmentSVG2 = stringToPrecomputedChunk('">');
        var endSegmentSVG = stringToPrecomputedChunk("</svg>");
        var startSegmentMathML = stringToPrecomputedChunk('<math aria-hidden="true" style="display:none" id="');
        var startSegmentMathML2 = stringToPrecomputedChunk('">');
        var endSegmentMathML = stringToPrecomputedChunk("</math>");
        var startSegmentTable = stringToPrecomputedChunk('<table hidden id="');
        var startSegmentTable2 = stringToPrecomputedChunk('">');
        var endSegmentTable = stringToPrecomputedChunk("</table>");
        var startSegmentTableBody = stringToPrecomputedChunk('<table hidden><tbody id="');
        var startSegmentTableBody2 = stringToPrecomputedChunk('">');
        var endSegmentTableBody = stringToPrecomputedChunk("</tbody></table>");
        var startSegmentTableRow = stringToPrecomputedChunk('<table hidden><tr id="');
        var startSegmentTableRow2 = stringToPrecomputedChunk('">');
        var endSegmentTableRow = stringToPrecomputedChunk("</tr></table>");
        var startSegmentColGroup = stringToPrecomputedChunk('<table hidden><colgroup id="');
        var startSegmentColGroup2 = stringToPrecomputedChunk('">');
        var endSegmentColGroup = stringToPrecomputedChunk("</colgroup></table>");
        function writeStartSegment(destination, responseState, formatContext, id) {
          switch (formatContext.insertionMode) {
            case ROOT_HTML_MODE:
            case HTML_MODE: {
              writeChunk(destination, startSegmentHTML);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentHTML2);
            }
            case SVG_MODE: {
              writeChunk(destination, startSegmentSVG);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentSVG2);
            }
            case MATHML_MODE: {
              writeChunk(destination, startSegmentMathML);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentMathML2);
            }
            case HTML_TABLE_MODE: {
              writeChunk(destination, startSegmentTable);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentTable2);
            }
            case HTML_TABLE_BODY_MODE: {
              writeChunk(destination, startSegmentTableBody);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentTableBody2);
            }
            case HTML_TABLE_ROW_MODE: {
              writeChunk(destination, startSegmentTableRow);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentTableRow2);
            }
            case HTML_COLGROUP_MODE: {
              writeChunk(destination, startSegmentColGroup);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentColGroup2);
            }
            default: {
              throw new Error("Unknown insertion mode. This is a bug in React.");
            }
          }
        }
        function writeEndSegment(destination, formatContext) {
          switch (formatContext.insertionMode) {
            case ROOT_HTML_MODE:
            case HTML_MODE: {
              return writeChunkAndReturn(destination, endSegmentHTML);
            }
            case SVG_MODE: {
              return writeChunkAndReturn(destination, endSegmentSVG);
            }
            case MATHML_MODE: {
              return writeChunkAndReturn(destination, endSegmentMathML);
            }
            case HTML_TABLE_MODE: {
              return writeChunkAndReturn(destination, endSegmentTable);
            }
            case HTML_TABLE_BODY_MODE: {
              return writeChunkAndReturn(destination, endSegmentTableBody);
            }
            case HTML_TABLE_ROW_MODE: {
              return writeChunkAndReturn(destination, endSegmentTableRow);
            }
            case HTML_COLGROUP_MODE: {
              return writeChunkAndReturn(destination, endSegmentColGroup);
            }
            default: {
              throw new Error("Unknown insertion mode. This is a bug in React.");
            }
          }
        }
        var completeSegmentFunction = "function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)}";
        var completeBoundaryFunction = 'function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}}';
        var clientRenderFunction = 'function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())}';
        var completeSegmentScript1Full = stringToPrecomputedChunk(completeSegmentFunction + ';$RS("');
        var completeSegmentScript1Partial = stringToPrecomputedChunk('$RS("');
        var completeSegmentScript2 = stringToPrecomputedChunk('","');
        var completeSegmentScript3 = stringToPrecomputedChunk('")<\/script>');
        function writeCompletedSegmentInstruction(destination, responseState, contentSegmentID) {
          writeChunk(destination, responseState.startInlineScript);
          if (!responseState.sentCompleteSegmentFunction) {
            responseState.sentCompleteSegmentFunction = true;
            writeChunk(destination, completeSegmentScript1Full);
          } else {
            writeChunk(destination, completeSegmentScript1Partial);
          }
          writeChunk(destination, responseState.segmentPrefix);
          var formattedID = stringToChunk(contentSegmentID.toString(16));
          writeChunk(destination, formattedID);
          writeChunk(destination, completeSegmentScript2);
          writeChunk(destination, responseState.placeholderPrefix);
          writeChunk(destination, formattedID);
          return writeChunkAndReturn(destination, completeSegmentScript3);
        }
        var completeBoundaryScript1Full = stringToPrecomputedChunk(completeBoundaryFunction + ';$RC("');
        var completeBoundaryScript1Partial = stringToPrecomputedChunk('$RC("');
        var completeBoundaryScript2 = stringToPrecomputedChunk('","');
        var completeBoundaryScript3 = stringToPrecomputedChunk('")<\/script>');
        function writeCompletedBoundaryInstruction(destination, responseState, boundaryID, contentSegmentID) {
          writeChunk(destination, responseState.startInlineScript);
          if (!responseState.sentCompleteBoundaryFunction) {
            responseState.sentCompleteBoundaryFunction = true;
            writeChunk(destination, completeBoundaryScript1Full);
          } else {
            writeChunk(destination, completeBoundaryScript1Partial);
          }
          if (boundaryID === null) {
            throw new Error("An ID must have been assigned before we can complete the boundary.");
          }
          var formattedContentID = stringToChunk(contentSegmentID.toString(16));
          writeChunk(destination, boundaryID);
          writeChunk(destination, completeBoundaryScript2);
          writeChunk(destination, responseState.segmentPrefix);
          writeChunk(destination, formattedContentID);
          return writeChunkAndReturn(destination, completeBoundaryScript3);
        }
        var clientRenderScript1Full = stringToPrecomputedChunk(clientRenderFunction + ';$RX("');
        var clientRenderScript1Partial = stringToPrecomputedChunk('$RX("');
        var clientRenderScript1A = stringToPrecomputedChunk('"');
        var clientRenderScript2 = stringToPrecomputedChunk(")<\/script>");
        var clientRenderErrorScriptArgInterstitial = stringToPrecomputedChunk(",");
        function writeClientRenderBoundaryInstruction(destination, responseState, boundaryID, errorDigest, errorMessage, errorComponentStack) {
          writeChunk(destination, responseState.startInlineScript);
          if (!responseState.sentClientRenderFunction) {
            responseState.sentClientRenderFunction = true;
            writeChunk(destination, clientRenderScript1Full);
          } else {
            writeChunk(destination, clientRenderScript1Partial);
          }
          if (boundaryID === null) {
            throw new Error("An ID must have been assigned before we can complete the boundary.");
          }
          writeChunk(destination, boundaryID);
          writeChunk(destination, clientRenderScript1A);
          if (errorDigest || errorMessage || errorComponentStack) {
            writeChunk(destination, clientRenderErrorScriptArgInterstitial);
            writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorDigest || "")));
          }
          if (errorMessage || errorComponentStack) {
            writeChunk(destination, clientRenderErrorScriptArgInterstitial);
            writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorMessage || "")));
          }
          if (errorComponentStack) {
            writeChunk(destination, clientRenderErrorScriptArgInterstitial);
            writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorComponentStack)));
          }
          return writeChunkAndReturn(destination, clientRenderScript2);
        }
        var regexForJSStringsInScripts = /[<\u2028\u2029]/g;
        function escapeJSStringsForInstructionScripts(input) {
          var escaped = JSON.stringify(input);
          return escaped.replace(regexForJSStringsInScripts, function(match) {
            switch (match) {
              case "<":
                return "\\u003c";
              case "\u2028":
                return "\\u2028";
              case "\u2029":
                return "\\u2029";
              default: {
                throw new Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
              }
            }
          });
        }
        function createResponseState$1(generateStaticMarkup, identifierPrefix) {
          var responseState = createResponseState(identifierPrefix, void 0);
          return {
            // Keep this in sync with ReactDOMServerFormatConfig
            bootstrapChunks: responseState.bootstrapChunks,
            startInlineScript: responseState.startInlineScript,
            placeholderPrefix: responseState.placeholderPrefix,
            segmentPrefix: responseState.segmentPrefix,
            boundaryPrefix: responseState.boundaryPrefix,
            idPrefix: responseState.idPrefix,
            nextSuspenseID: responseState.nextSuspenseID,
            sentCompleteSegmentFunction: responseState.sentCompleteSegmentFunction,
            sentCompleteBoundaryFunction: responseState.sentCompleteBoundaryFunction,
            sentClientRenderFunction: responseState.sentClientRenderFunction,
            // This is an extra field for the legacy renderer
            generateStaticMarkup
          };
        }
        function createRootFormatContext() {
          return {
            insertionMode: HTML_MODE,
            // We skip the root mode because we don't want to emit the DOCTYPE in legacy mode.
            selectedValue: null
          };
        }
        function pushTextInstance$1(target, text, responseState, textEmbedded) {
          if (responseState.generateStaticMarkup) {
            target.push(stringToChunk(escapeTextForBrowser(text)));
            return false;
          } else {
            return pushTextInstance(target, text, responseState, textEmbedded);
          }
        }
        function pushSegmentFinale$1(target, responseState, lastPushedText, textEmbedded) {
          if (responseState.generateStaticMarkup) {
            return;
          } else {
            return pushSegmentFinale(target, responseState, lastPushedText, textEmbedded);
          }
        }
        function writeStartCompletedSuspenseBoundary$1(destination, responseState) {
          if (responseState.generateStaticMarkup) {
            return true;
          }
          return writeStartCompletedSuspenseBoundary(destination);
        }
        function writeStartClientRenderedSuspenseBoundary$1(destination, responseState, errorDigest, errorMessage, errorComponentStack) {
          if (responseState.generateStaticMarkup) {
            return true;
          }
          return writeStartClientRenderedSuspenseBoundary(destination, responseState, errorDigest, errorMessage, errorComponentStack);
        }
        function writeEndCompletedSuspenseBoundary$1(destination, responseState) {
          if (responseState.generateStaticMarkup) {
            return true;
          }
          return writeEndCompletedSuspenseBoundary(destination);
        }
        function writeEndClientRenderedSuspenseBoundary$1(destination, responseState) {
          if (responseState.generateStaticMarkup) {
            return true;
          }
          return writeEndClientRenderedSuspenseBoundary(destination);
        }
        var assign = Object.assign;
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PORTAL_TYPE = Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var REACT_SCOPE_TYPE = Symbol.for("react.scope");
        var REACT_DEBUG_TRACING_MODE_TYPE = Symbol.for("react.debug_trace_mode");
        var REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden");
        var REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = Symbol.for("react.default_value");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x) {
                var match = x.stack.trim().match(/\n( *(at )?)/);
                prefix = match && match[1] || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn, construct) {
          if (!fn || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher.current;
            ReactCurrentDispatcher.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x) {
                  control = x;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              }
              fn();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c = controlLines.length - 1;
              while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                c--;
              }
              for (; s >= 1 && c >= 0; s--, c--) {
                if (sampleLines[s] !== controlLines[c]) {
                  if (s !== 1 || c !== 1) {
                    do {
                      s--;
                      c--;
                      if (c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        if (fn.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn.displayName);
                        }
                        {
                          if (typeof fn === "function") {
                            componentFrameCache.set(fn, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn ? fn.displayName || fn.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn === "function") {
              componentFrameCache.set(fn, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeClassComponentFrame(ctor, source, ownerFn) {
          {
            return describeNativeComponentFrame(ctor, true);
          }
        }
        function describeFunctionComponentFrame(fn, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn, false);
          }
        }
        function shouldConstruct(Component) {
          var prototype = Component.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {
                }
              }
            }
          }
          return "";
        }
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        var warnedAboutMissingGetChildContext;
        {
          warnedAboutMissingGetChildContext = {};
        }
        var emptyContextObject = {};
        {
          Object.freeze(emptyContextObject);
        }
        function getMaskedContext(type, unmaskedContext) {
          {
            var contextTypes = type.contextTypes;
            if (!contextTypes) {
              return emptyContextObject;
            }
            var context = {};
            for (var key in contextTypes) {
              context[key] = unmaskedContext[key];
            }
            {
              var name = getComponentNameFromType(type) || "Unknown";
              checkPropTypes(contextTypes, context, "context", name);
            }
            return context;
          }
        }
        function processChildContext(instance, type, parentContext, childContextTypes) {
          {
            if (typeof instance.getChildContext !== "function") {
              {
                var componentName = getComponentNameFromType(type) || "Unknown";
                if (!warnedAboutMissingGetChildContext[componentName]) {
                  warnedAboutMissingGetChildContext[componentName] = true;
                  error("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", componentName, componentName);
                }
              }
              return parentContext;
            }
            var childContext = instance.getChildContext();
            for (var contextKey in childContext) {
              if (!(contextKey in childContextTypes)) {
                throw new Error((getComponentNameFromType(type) || "Unknown") + '.getChildContext(): key "' + contextKey + '" is not defined in childContextTypes.');
              }
            }
            {
              var name = getComponentNameFromType(type) || "Unknown";
              checkPropTypes(childContextTypes, childContext, "child context", name);
            }
            return assign({}, parentContext, childContext);
          }
        }
        var rendererSigil;
        {
          rendererSigil = {};
        }
        var rootContextSnapshot = null;
        var currentActiveSnapshot = null;
        function popNode(prev) {
          {
            prev.context._currentValue2 = prev.parentValue;
          }
        }
        function pushNode(next) {
          {
            next.context._currentValue2 = next.value;
          }
        }
        function popToNearestCommonAncestor(prev, next) {
          if (prev === next) ;
          else {
            popNode(prev);
            var parentPrev = prev.parent;
            var parentNext = next.parent;
            if (parentPrev === null) {
              if (parentNext !== null) {
                throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
              }
            } else {
              if (parentNext === null) {
                throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
              }
              popToNearestCommonAncestor(parentPrev, parentNext);
            }
            pushNode(next);
          }
        }
        function popAllPrevious(prev) {
          popNode(prev);
          var parentPrev = prev.parent;
          if (parentPrev !== null) {
            popAllPrevious(parentPrev);
          }
        }
        function pushAllNext(next) {
          var parentNext = next.parent;
          if (parentNext !== null) {
            pushAllNext(parentNext);
          }
          pushNode(next);
        }
        function popPreviousToCommonLevel(prev, next) {
          popNode(prev);
          var parentPrev = prev.parent;
          if (parentPrev === null) {
            throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
          }
          if (parentPrev.depth === next.depth) {
            popToNearestCommonAncestor(parentPrev, next);
          } else {
            popPreviousToCommonLevel(parentPrev, next);
          }
        }
        function popNextToCommonLevel(prev, next) {
          var parentNext = next.parent;
          if (parentNext === null) {
            throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
          }
          if (prev.depth === parentNext.depth) {
            popToNearestCommonAncestor(prev, parentNext);
          } else {
            popNextToCommonLevel(prev, parentNext);
          }
          pushNode(next);
        }
        function switchContext(newSnapshot) {
          var prev = currentActiveSnapshot;
          var next = newSnapshot;
          if (prev !== next) {
            if (prev === null) {
              pushAllNext(next);
            } else if (next === null) {
              popAllPrevious(prev);
            } else if (prev.depth === next.depth) {
              popToNearestCommonAncestor(prev, next);
            } else if (prev.depth > next.depth) {
              popPreviousToCommonLevel(prev, next);
            } else {
              popNextToCommonLevel(prev, next);
            }
            currentActiveSnapshot = next;
          }
        }
        function pushProvider(context, nextValue) {
          var prevValue;
          {
            prevValue = context._currentValue2;
            context._currentValue2 = nextValue;
            {
              if (context._currentRenderer2 !== void 0 && context._currentRenderer2 !== null && context._currentRenderer2 !== rendererSigil) {
                error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
              }
              context._currentRenderer2 = rendererSigil;
            }
          }
          var prevNode = currentActiveSnapshot;
          var newNode = {
            parent: prevNode,
            depth: prevNode === null ? 0 : prevNode.depth + 1,
            context,
            parentValue: prevValue,
            value: nextValue
          };
          currentActiveSnapshot = newNode;
          return newNode;
        }
        function popProvider(context) {
          var prevSnapshot = currentActiveSnapshot;
          if (prevSnapshot === null) {
            throw new Error("Tried to pop a Context at the root of the app. This is a bug in React.");
          }
          {
            if (prevSnapshot.context !== context) {
              error("The parent context is not the expected context. This is probably a bug in React.");
            }
          }
          {
            var _value = prevSnapshot.parentValue;
            if (_value === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
              prevSnapshot.context._currentValue2 = prevSnapshot.context._defaultValue;
            } else {
              prevSnapshot.context._currentValue2 = _value;
            }
            {
              if (context._currentRenderer2 !== void 0 && context._currentRenderer2 !== null && context._currentRenderer2 !== rendererSigil) {
                error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
              }
              context._currentRenderer2 = rendererSigil;
            }
          }
          return currentActiveSnapshot = prevSnapshot.parent;
        }
        function getActiveContext() {
          return currentActiveSnapshot;
        }
        function readContext(context) {
          var value = context._currentValue2;
          return value;
        }
        function get(key) {
          return key._reactInternals;
        }
        function set(key, value) {
          key._reactInternals = value;
        }
        var didWarnAboutNoopUpdateForComponent = {};
        var didWarnAboutDeprecatedWillMount = {};
        var didWarnAboutUninitializedState;
        var didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate;
        var didWarnAboutLegacyLifecyclesAndDerivedState;
        var didWarnAboutUndefinedDerivedState;
        var warnOnUndefinedDerivedState;
        var warnOnInvalidCallback;
        var didWarnAboutDirectlyAssigningPropsToState;
        var didWarnAboutContextTypeAndContextTypes;
        var didWarnAboutInvalidateContextType;
        {
          didWarnAboutUninitializedState = /* @__PURE__ */ new Set();
          didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = /* @__PURE__ */ new Set();
          didWarnAboutLegacyLifecyclesAndDerivedState = /* @__PURE__ */ new Set();
          didWarnAboutDirectlyAssigningPropsToState = /* @__PURE__ */ new Set();
          didWarnAboutUndefinedDerivedState = /* @__PURE__ */ new Set();
          didWarnAboutContextTypeAndContextTypes = /* @__PURE__ */ new Set();
          didWarnAboutInvalidateContextType = /* @__PURE__ */ new Set();
          var didWarnOnInvalidCallback = /* @__PURE__ */ new Set();
          warnOnInvalidCallback = function(callback, callerName) {
            if (callback === null || typeof callback === "function") {
              return;
            }
            var key = callerName + "_" + callback;
            if (!didWarnOnInvalidCallback.has(key)) {
              didWarnOnInvalidCallback.add(key);
              error("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", callerName, callback);
            }
          };
          warnOnUndefinedDerivedState = function(type, partialState) {
            if (partialState === void 0) {
              var componentName = getComponentNameFromType(type) || "Component";
              if (!didWarnAboutUndefinedDerivedState.has(componentName)) {
                didWarnAboutUndefinedDerivedState.add(componentName);
                error("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", componentName);
              }
            }
          };
        }
        function warnNoop(publicInstance, callerName) {
          {
            var _constructor = publicInstance.constructor;
            var componentName = _constructor && getComponentNameFromType(_constructor) || "ReactClass";
            var warningKey = componentName + "." + callerName;
            if (didWarnAboutNoopUpdateForComponent[warningKey]) {
              return;
            }
            error("%s(...): Can only update a mounting component. This usually means you called %s() outside componentWillMount() on the server. This is a no-op.\n\nPlease check the code for the %s component.", callerName, callerName, componentName);
            didWarnAboutNoopUpdateForComponent[warningKey] = true;
          }
        }
        var classComponentUpdater = {
          isMounted: function(inst) {
            return false;
          },
          enqueueSetState: function(inst, payload, callback) {
            var internals = get(inst);
            if (internals.queue === null) {
              warnNoop(inst, "setState");
            } else {
              internals.queue.push(payload);
              {
                if (callback !== void 0 && callback !== null) {
                  warnOnInvalidCallback(callback, "setState");
                }
              }
            }
          },
          enqueueReplaceState: function(inst, payload, callback) {
            var internals = get(inst);
            internals.replace = true;
            internals.queue = [payload];
            {
              if (callback !== void 0 && callback !== null) {
                warnOnInvalidCallback(callback, "setState");
              }
            }
          },
          enqueueForceUpdate: function(inst, callback) {
            var internals = get(inst);
            if (internals.queue === null) {
              warnNoop(inst, "forceUpdate");
            } else {
              {
                if (callback !== void 0 && callback !== null) {
                  warnOnInvalidCallback(callback, "setState");
                }
              }
            }
          }
        };
        function applyDerivedStateFromProps(instance, ctor, getDerivedStateFromProps, prevState, nextProps) {
          var partialState = getDerivedStateFromProps(nextProps, prevState);
          {
            warnOnUndefinedDerivedState(ctor, partialState);
          }
          var newState = partialState === null || partialState === void 0 ? prevState : assign({}, prevState, partialState);
          return newState;
        }
        function constructClassInstance(ctor, props, maskedLegacyContext) {
          var context = emptyContextObject;
          var contextType = ctor.contextType;
          {
            if ("contextType" in ctor) {
              var isValid = (
                // Allow null for conditional declaration
                contextType === null || contextType !== void 0 && contextType.$$typeof === REACT_CONTEXT_TYPE && contextType._context === void 0
              );
              if (!isValid && !didWarnAboutInvalidateContextType.has(ctor)) {
                didWarnAboutInvalidateContextType.add(ctor);
                var addendum = "";
                if (contextType === void 0) {
                  addendum = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file.";
                } else if (typeof contextType !== "object") {
                  addendum = " However, it is set to a " + typeof contextType + ".";
                } else if (contextType.$$typeof === REACT_PROVIDER_TYPE) {
                  addendum = " Did you accidentally pass the Context.Provider instead?";
                } else if (contextType._context !== void 0) {
                  addendum = " Did you accidentally pass the Context.Consumer instead?";
                } else {
                  addendum = " However, it is set to an object with keys {" + Object.keys(contextType).join(", ") + "}.";
                }
                error("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", getComponentNameFromType(ctor) || "Component", addendum);
              }
            }
          }
          if (typeof contextType === "object" && contextType !== null) {
            context = readContext(contextType);
          } else {
            context = maskedLegacyContext;
          }
          var instance = new ctor(props, context);
          {
            if (typeof ctor.getDerivedStateFromProps === "function" && (instance.state === null || instance.state === void 0)) {
              var componentName = getComponentNameFromType(ctor) || "Component";
              if (!didWarnAboutUninitializedState.has(componentName)) {
                didWarnAboutUninitializedState.add(componentName);
                error("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", componentName, instance.state === null ? "null" : "undefined", componentName);
              }
            }
            if (typeof ctor.getDerivedStateFromProps === "function" || typeof instance.getSnapshotBeforeUpdate === "function") {
              var foundWillMountName = null;
              var foundWillReceivePropsName = null;
              var foundWillUpdateName = null;
              if (typeof instance.componentWillMount === "function" && instance.componentWillMount.__suppressDeprecationWarning !== true) {
                foundWillMountName = "componentWillMount";
              } else if (typeof instance.UNSAFE_componentWillMount === "function") {
                foundWillMountName = "UNSAFE_componentWillMount";
              }
              if (typeof instance.componentWillReceiveProps === "function" && instance.componentWillReceiveProps.__suppressDeprecationWarning !== true) {
                foundWillReceivePropsName = "componentWillReceiveProps";
              } else if (typeof instance.UNSAFE_componentWillReceiveProps === "function") {
                foundWillReceivePropsName = "UNSAFE_componentWillReceiveProps";
              }
              if (typeof instance.componentWillUpdate === "function" && instance.componentWillUpdate.__suppressDeprecationWarning !== true) {
                foundWillUpdateName = "componentWillUpdate";
              } else if (typeof instance.UNSAFE_componentWillUpdate === "function") {
                foundWillUpdateName = "UNSAFE_componentWillUpdate";
              }
              if (foundWillMountName !== null || foundWillReceivePropsName !== null || foundWillUpdateName !== null) {
                var _componentName = getComponentNameFromType(ctor) || "Component";
                var newApiName = typeof ctor.getDerivedStateFromProps === "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
                if (!didWarnAboutLegacyLifecyclesAndDerivedState.has(_componentName)) {
                  didWarnAboutLegacyLifecyclesAndDerivedState.add(_componentName);
                  error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://reactjs.org/link/unsafe-component-lifecycles", _componentName, newApiName, foundWillMountName !== null ? "\n  " + foundWillMountName : "", foundWillReceivePropsName !== null ? "\n  " + foundWillReceivePropsName : "", foundWillUpdateName !== null ? "\n  " + foundWillUpdateName : "");
                }
              }
            }
          }
          return instance;
        }
        function checkClassInstance(instance, ctor, newProps) {
          {
            var name = getComponentNameFromType(ctor) || "Component";
            var renderPresent = instance.render;
            if (!renderPresent) {
              if (ctor.prototype && typeof ctor.prototype.render === "function") {
                error("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", name);
              } else {
                error("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", name);
              }
            }
            if (instance.getInitialState && !instance.getInitialState.isReactClassApproved && !instance.state) {
              error("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", name);
            }
            if (instance.getDefaultProps && !instance.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", name);
            }
            if (instance.propTypes) {
              error("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", name);
            }
            if (instance.contextType) {
              error("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", name);
            }
            {
              if (instance.contextTypes) {
                error("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", name);
              }
              if (ctor.contextType && ctor.contextTypes && !didWarnAboutContextTypeAndContextTypes.has(ctor)) {
                didWarnAboutContextTypeAndContextTypes.add(ctor);
                error("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", name);
              }
            }
            if (typeof instance.componentShouldUpdate === "function") {
              error("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", name);
            }
            if (ctor.prototype && ctor.prototype.isPureReactComponent && typeof instance.shouldComponentUpdate !== "undefined") {
              error("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", getComponentNameFromType(ctor) || "A pure component");
            }
            if (typeof instance.componentDidUnmount === "function") {
              error("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", name);
            }
            if (typeof instance.componentDidReceiveProps === "function") {
              error("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", name);
            }
            if (typeof instance.componentWillRecieveProps === "function") {
              error("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", name);
            }
            if (typeof instance.UNSAFE_componentWillRecieveProps === "function") {
              error("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", name);
            }
            var hasMutatedProps = instance.props !== newProps;
            if (instance.props !== void 0 && hasMutatedProps) {
              error("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", name, name);
            }
            if (instance.defaultProps) {
              error("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", name, name);
            }
            if (typeof instance.getSnapshotBeforeUpdate === "function" && typeof instance.componentDidUpdate !== "function" && !didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.has(ctor)) {
              didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.add(ctor);
              error("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", getComponentNameFromType(ctor));
            }
            if (typeof instance.getDerivedStateFromProps === "function") {
              error("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
            }
            if (typeof instance.getDerivedStateFromError === "function") {
              error("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
            }
            if (typeof ctor.getSnapshotBeforeUpdate === "function") {
              error("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", name);
            }
            var _state = instance.state;
            if (_state && (typeof _state !== "object" || isArray(_state))) {
              error("%s.state: must be set to an object or null", name);
            }
            if (typeof instance.getChildContext === "function" && typeof ctor.childContextTypes !== "object") {
              error("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", name);
            }
          }
        }
        function callComponentWillMount(type, instance) {
          var oldState = instance.state;
          if (typeof instance.componentWillMount === "function") {
            {
              if (instance.componentWillMount.__suppressDeprecationWarning !== true) {
                var componentName = getComponentNameFromType(type) || "Unknown";
                if (!didWarnAboutDeprecatedWillMount[componentName]) {
                  warn(
                    // keep this warning in sync with ReactStrictModeWarning.js
                    "componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n* Move code from componentWillMount to componentDidMount (preferred in most cases) or the constructor.\n\nPlease update the following components: %s",
                    componentName
                  );
                  didWarnAboutDeprecatedWillMount[componentName] = true;
                }
              }
            }
            instance.componentWillMount();
          }
          if (typeof instance.UNSAFE_componentWillMount === "function") {
            instance.UNSAFE_componentWillMount();
          }
          if (oldState !== instance.state) {
            {
              error("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", getComponentNameFromType(type) || "Component");
            }
            classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
          }
        }
        function processUpdateQueue(internalInstance, inst, props, maskedLegacyContext) {
          if (internalInstance.queue !== null && internalInstance.queue.length > 0) {
            var oldQueue = internalInstance.queue;
            var oldReplace = internalInstance.replace;
            internalInstance.queue = null;
            internalInstance.replace = false;
            if (oldReplace && oldQueue.length === 1) {
              inst.state = oldQueue[0];
            } else {
              var nextState = oldReplace ? oldQueue[0] : inst.state;
              var dontMutate = true;
              for (var i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
                var partial = oldQueue[i];
                var partialState = typeof partial === "function" ? partial.call(inst, nextState, props, maskedLegacyContext) : partial;
                if (partialState != null) {
                  if (dontMutate) {
                    dontMutate = false;
                    nextState = assign({}, nextState, partialState);
                  } else {
                    assign(nextState, partialState);
                  }
                }
              }
              inst.state = nextState;
            }
          } else {
            internalInstance.queue = null;
          }
        }
        function mountClassInstance(instance, ctor, newProps, maskedLegacyContext) {
          {
            checkClassInstance(instance, ctor, newProps);
          }
          var initialState = instance.state !== void 0 ? instance.state : null;
          instance.updater = classComponentUpdater;
          instance.props = newProps;
          instance.state = initialState;
          var internalInstance = {
            queue: [],
            replace: false
          };
          set(instance, internalInstance);
          var contextType = ctor.contextType;
          if (typeof contextType === "object" && contextType !== null) {
            instance.context = readContext(contextType);
          } else {
            instance.context = maskedLegacyContext;
          }
          {
            if (instance.state === newProps) {
              var componentName = getComponentNameFromType(ctor) || "Component";
              if (!didWarnAboutDirectlyAssigningPropsToState.has(componentName)) {
                didWarnAboutDirectlyAssigningPropsToState.add(componentName);
                error("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", componentName);
              }
            }
          }
          var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
          if (typeof getDerivedStateFromProps === "function") {
            instance.state = applyDerivedStateFromProps(instance, ctor, getDerivedStateFromProps, initialState, newProps);
          }
          if (typeof ctor.getDerivedStateFromProps !== "function" && typeof instance.getSnapshotBeforeUpdate !== "function" && (typeof instance.UNSAFE_componentWillMount === "function" || typeof instance.componentWillMount === "function")) {
            callComponentWillMount(ctor, instance);
            processUpdateQueue(internalInstance, instance, newProps, maskedLegacyContext);
          }
        }
        var emptyTreeContext = {
          id: 1,
          overflow: ""
        };
        function getTreeId(context) {
          var overflow = context.overflow;
          var idWithLeadingBit = context.id;
          var id = idWithLeadingBit & ~getLeadingBit(idWithLeadingBit);
          return id.toString(32) + overflow;
        }
        function pushTreeContext(baseContext, totalChildren, index) {
          var baseIdWithLeadingBit = baseContext.id;
          var baseOverflow = baseContext.overflow;
          var baseLength = getBitLength(baseIdWithLeadingBit) - 1;
          var baseId = baseIdWithLeadingBit & ~(1 << baseLength);
          var slot = index + 1;
          var length = getBitLength(totalChildren) + baseLength;
          if (length > 30) {
            var numberOfOverflowBits = baseLength - baseLength % 5;
            var newOverflowBits = (1 << numberOfOverflowBits) - 1;
            var newOverflow = (baseId & newOverflowBits).toString(32);
            var restOfBaseId = baseId >> numberOfOverflowBits;
            var restOfBaseLength = baseLength - numberOfOverflowBits;
            var restOfLength = getBitLength(totalChildren) + restOfBaseLength;
            var restOfNewBits = slot << restOfBaseLength;
            var id = restOfNewBits | restOfBaseId;
            var overflow = newOverflow + baseOverflow;
            return {
              id: 1 << restOfLength | id,
              overflow
            };
          } else {
            var newBits = slot << baseLength;
            var _id = newBits | baseId;
            var _overflow = baseOverflow;
            return {
              id: 1 << length | _id,
              overflow: _overflow
            };
          }
        }
        function getBitLength(number) {
          return 32 - clz32(number);
        }
        function getLeadingBit(id) {
          return 1 << getBitLength(id) - 1;
        }
        var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
        var log = Math.log;
        var LN2 = Math.LN2;
        function clz32Fallback(x) {
          var asUint = x >>> 0;
          if (asUint === 0) {
            return 32;
          }
          return 31 - (log(asUint) / LN2 | 0) | 0;
        }
        function is(x, y) {
          return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
        }
        var objectIs = typeof Object.is === "function" ? Object.is : is;
        var currentlyRenderingComponent = null;
        var currentlyRenderingTask = null;
        var firstWorkInProgressHook = null;
        var workInProgressHook = null;
        var isReRender = false;
        var didScheduleRenderPhaseUpdate = false;
        var localIdCounter = 0;
        var renderPhaseUpdates = null;
        var numberOfReRenders = 0;
        var RE_RENDER_LIMIT = 25;
        var isInHookUserCodeInDev = false;
        var currentHookNameInDev;
        function resolveCurrentlyRenderingComponent() {
          if (currentlyRenderingComponent === null) {
            throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
          }
          {
            if (isInHookUserCodeInDev) {
              error("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
            }
          }
          return currentlyRenderingComponent;
        }
        function areHookInputsEqual(nextDeps, prevDeps) {
          if (prevDeps === null) {
            {
              error("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", currentHookNameInDev);
            }
            return false;
          }
          {
            if (nextDeps.length !== prevDeps.length) {
              error("The final argument passed to %s changed size between renders. The order and size of this array must remain constant.\n\nPrevious: %s\nIncoming: %s", currentHookNameInDev, "[" + nextDeps.join(", ") + "]", "[" + prevDeps.join(", ") + "]");
            }
          }
          for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
            if (objectIs(nextDeps[i], prevDeps[i])) {
              continue;
            }
            return false;
          }
          return true;
        }
        function createHook() {
          if (numberOfReRenders > 0) {
            throw new Error("Rendered more hooks than during the previous render");
          }
          return {
            memoizedState: null,
            queue: null,
            next: null
          };
        }
        function createWorkInProgressHook() {
          if (workInProgressHook === null) {
            if (firstWorkInProgressHook === null) {
              isReRender = false;
              firstWorkInProgressHook = workInProgressHook = createHook();
            } else {
              isReRender = true;
              workInProgressHook = firstWorkInProgressHook;
            }
          } else {
            if (workInProgressHook.next === null) {
              isReRender = false;
              workInProgressHook = workInProgressHook.next = createHook();
            } else {
              isReRender = true;
              workInProgressHook = workInProgressHook.next;
            }
          }
          return workInProgressHook;
        }
        function prepareToUseHooks(task, componentIdentity) {
          currentlyRenderingComponent = componentIdentity;
          currentlyRenderingTask = task;
          {
            isInHookUserCodeInDev = false;
          }
          localIdCounter = 0;
        }
        function finishHooks(Component, props, children, refOrContext) {
          while (didScheduleRenderPhaseUpdate) {
            didScheduleRenderPhaseUpdate = false;
            localIdCounter = 0;
            numberOfReRenders += 1;
            workInProgressHook = null;
            children = Component(props, refOrContext);
          }
          resetHooksState();
          return children;
        }
        function checkDidRenderIdHook() {
          var didRenderIdHook = localIdCounter !== 0;
          return didRenderIdHook;
        }
        function resetHooksState() {
          {
            isInHookUserCodeInDev = false;
          }
          currentlyRenderingComponent = null;
          currentlyRenderingTask = null;
          didScheduleRenderPhaseUpdate = false;
          firstWorkInProgressHook = null;
          numberOfReRenders = 0;
          renderPhaseUpdates = null;
          workInProgressHook = null;
        }
        function readContext$1(context) {
          {
            if (isInHookUserCodeInDev) {
              error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
            }
          }
          return readContext(context);
        }
        function useContext(context) {
          {
            currentHookNameInDev = "useContext";
          }
          resolveCurrentlyRenderingComponent();
          return readContext(context);
        }
        function basicStateReducer(state, action) {
          return typeof action === "function" ? action(state) : action;
        }
        function useState(initialState) {
          {
            currentHookNameInDev = "useState";
          }
          return useReducer(
            basicStateReducer,
            // useReducer has a special case to support lazy useState initializers
            initialState
          );
        }
        function useReducer(reducer, initialArg, init) {
          {
            if (reducer !== basicStateReducer) {
              currentHookNameInDev = "useReducer";
            }
          }
          currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
          workInProgressHook = createWorkInProgressHook();
          if (isReRender) {
            var queue = workInProgressHook.queue;
            var dispatch = queue.dispatch;
            if (renderPhaseUpdates !== null) {
              var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
              if (firstRenderPhaseUpdate !== void 0) {
                renderPhaseUpdates.delete(queue);
                var newState = workInProgressHook.memoizedState;
                var update = firstRenderPhaseUpdate;
                do {
                  var action = update.action;
                  {
                    isInHookUserCodeInDev = true;
                  }
                  newState = reducer(newState, action);
                  {
                    isInHookUserCodeInDev = false;
                  }
                  update = update.next;
                } while (update !== null);
                workInProgressHook.memoizedState = newState;
                return [newState, dispatch];
              }
            }
            return [workInProgressHook.memoizedState, dispatch];
          } else {
            {
              isInHookUserCodeInDev = true;
            }
            var initialState;
            if (reducer === basicStateReducer) {
              initialState = typeof initialArg === "function" ? initialArg() : initialArg;
            } else {
              initialState = init !== void 0 ? init(initialArg) : initialArg;
            }
            {
              isInHookUserCodeInDev = false;
            }
            workInProgressHook.memoizedState = initialState;
            var _queue = workInProgressHook.queue = {
              last: null,
              dispatch: null
            };
            var _dispatch = _queue.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, _queue);
            return [workInProgressHook.memoizedState, _dispatch];
          }
        }
        function useMemo(nextCreate, deps) {
          currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
          workInProgressHook = createWorkInProgressHook();
          var nextDeps = deps === void 0 ? null : deps;
          if (workInProgressHook !== null) {
            var prevState = workInProgressHook.memoizedState;
            if (prevState !== null) {
              if (nextDeps !== null) {
                var prevDeps = prevState[1];
                if (areHookInputsEqual(nextDeps, prevDeps)) {
                  return prevState[0];
                }
              }
            }
          }
          {
            isInHookUserCodeInDev = true;
          }
          var nextValue = nextCreate();
          {
            isInHookUserCodeInDev = false;
          }
          workInProgressHook.memoizedState = [nextValue, nextDeps];
          return nextValue;
        }
        function useRef(initialValue) {
          currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
          workInProgressHook = createWorkInProgressHook();
          var previousRef = workInProgressHook.memoizedState;
          if (previousRef === null) {
            var ref = {
              current: initialValue
            };
            {
              Object.seal(ref);
            }
            workInProgressHook.memoizedState = ref;
            return ref;
          } else {
            return previousRef;
          }
        }
        function useLayoutEffect(create, inputs) {
          {
            currentHookNameInDev = "useLayoutEffect";
            error("useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format. This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this, useLayoutEffect should only be used in components that render exclusively on the client. See https://reactjs.org/link/uselayouteffect-ssr for common fixes.");
          }
        }
        function dispatchAction(componentIdentity, queue, action) {
          if (numberOfReRenders >= RE_RENDER_LIMIT) {
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          }
          if (componentIdentity === currentlyRenderingComponent) {
            didScheduleRenderPhaseUpdate = true;
            var update = {
              action,
              next: null
            };
            if (renderPhaseUpdates === null) {
              renderPhaseUpdates = /* @__PURE__ */ new Map();
            }
            var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
            if (firstRenderPhaseUpdate === void 0) {
              renderPhaseUpdates.set(queue, update);
            } else {
              var lastRenderPhaseUpdate = firstRenderPhaseUpdate;
              while (lastRenderPhaseUpdate.next !== null) {
                lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
              }
              lastRenderPhaseUpdate.next = update;
            }
          }
        }
        function useCallback(callback, deps) {
          return useMemo(function() {
            return callback;
          }, deps);
        }
        function useMutableSource(source, getSnapshot, subscribe) {
          resolveCurrentlyRenderingComponent();
          return getSnapshot(source._source);
        }
        function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
          if (getServerSnapshot === void 0) {
            throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
          }
          return getServerSnapshot();
        }
        function useDeferredValue(value) {
          resolveCurrentlyRenderingComponent();
          return value;
        }
        function unsupportedStartTransition() {
          throw new Error("startTransition cannot be called during server rendering.");
        }
        function useTransition() {
          resolveCurrentlyRenderingComponent();
          return [false, unsupportedStartTransition];
        }
        function useId() {
          var task = currentlyRenderingTask;
          var treeId = getTreeId(task.treeContext);
          var responseState = currentResponseState;
          if (responseState === null) {
            throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component.");
          }
          var localId = localIdCounter++;
          return makeId(responseState, treeId, localId);
        }
        function noop() {
        }
        var Dispatcher = {
          readContext: readContext$1,
          useContext,
          useMemo,
          useReducer,
          useRef,
          useState,
          useInsertionEffect: noop,
          useLayoutEffect,
          useCallback,
          // useImperativeHandle is not run in the server environment
          useImperativeHandle: noop,
          // Effects are not run in the server environment.
          useEffect: noop,
          // Debugging effect
          useDebugValue: noop,
          useDeferredValue,
          useTransition,
          useId,
          // Subscriptions are not setup in a server environment.
          useMutableSource,
          useSyncExternalStore
        };
        var currentResponseState = null;
        function setCurrentResponseState(responseState) {
          currentResponseState = responseState;
        }
        function getStackByComponentStackNode(componentStack) {
          try {
            var info = "";
            var node = componentStack;
            do {
              switch (node.tag) {
                case 0:
                  info += describeBuiltInComponentFrame(node.type, null, null);
                  break;
                case 1:
                  info += describeFunctionComponentFrame(node.type, null, null);
                  break;
                case 2:
                  info += describeClassComponentFrame(node.type, null, null);
                  break;
              }
              node = node.parent;
            } while (node);
            return info;
          } catch (x) {
            return "\nError generating stack: " + x.message + "\n" + x.stack;
          }
        }
        var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        var PENDING = 0;
        var COMPLETED = 1;
        var FLUSHED = 2;
        var ABORTED = 3;
        var ERRORED = 4;
        var OPEN = 0;
        var CLOSING = 1;
        var CLOSED = 2;
        var DEFAULT_PROGRESSIVE_CHUNK_SIZE = 12800;
        function defaultErrorHandler(error2) {
          console["error"](error2);
          return null;
        }
        function noop$1() {
        }
        function createRequest(children, responseState, rootFormatContext, progressiveChunkSize, onError2, onAllReady, onShellReady, onShellError, onFatalError) {
          var pingedTasks = [];
          var abortSet = /* @__PURE__ */ new Set();
          var request = {
            destination: null,
            responseState,
            progressiveChunkSize: progressiveChunkSize === void 0 ? DEFAULT_PROGRESSIVE_CHUNK_SIZE : progressiveChunkSize,
            status: OPEN,
            fatalError: null,
            nextSegmentId: 0,
            allPendingTasks: 0,
            pendingRootTasks: 0,
            completedRootSegment: null,
            abortableTasks: abortSet,
            pingedTasks,
            clientRenderedBoundaries: [],
            completedBoundaries: [],
            partialBoundaries: [],
            onError: onError2 === void 0 ? defaultErrorHandler : onError2,
            onAllReady: onAllReady === void 0 ? noop$1 : onAllReady,
            onShellReady: onShellReady === void 0 ? noop$1 : onShellReady,
            onShellError: onShellError === void 0 ? noop$1 : onShellError,
            onFatalError: onFatalError === void 0 ? noop$1 : onFatalError
          };
          var rootSegment = createPendingSegment(
            request,
            0,
            null,
            rootFormatContext,
            // Root segments are never embedded in Text on either edge
            false,
            false
          );
          rootSegment.parentFlushed = true;
          var rootTask = createTask(request, children, null, rootSegment, abortSet, emptyContextObject, rootContextSnapshot, emptyTreeContext);
          pingedTasks.push(rootTask);
          return request;
        }
        function pingTask(request, task) {
          var pingedTasks = request.pingedTasks;
          pingedTasks.push(task);
          if (pingedTasks.length === 1) {
            scheduleWork(function() {
              return performWork(request);
            });
          }
        }
        function createSuspenseBoundary(request, fallbackAbortableTasks) {
          return {
            id: UNINITIALIZED_SUSPENSE_BOUNDARY_ID,
            rootSegmentID: -1,
            parentFlushed: false,
            pendingTasks: 0,
            forceClientRender: false,
            completedSegments: [],
            byteSize: 0,
            fallbackAbortableTasks,
            errorDigest: null
          };
        }
        function createTask(request, node, blockedBoundary, blockedSegment, abortSet, legacyContext, context, treeContext) {
          request.allPendingTasks++;
          if (blockedBoundary === null) {
            request.pendingRootTasks++;
          } else {
            blockedBoundary.pendingTasks++;
          }
          var task = {
            node,
            ping: function() {
              return pingTask(request, task);
            },
            blockedBoundary,
            blockedSegment,
            abortSet,
            legacyContext,
            context,
            treeContext
          };
          {
            task.componentStack = null;
          }
          abortSet.add(task);
          return task;
        }
        function createPendingSegment(request, index, boundary, formatContext, lastPushedText, textEmbedded) {
          return {
            status: PENDING,
            id: -1,
            // lazily assigned later
            index,
            parentFlushed: false,
            chunks: [],
            children: [],
            formatContext,
            boundary,
            lastPushedText,
            textEmbedded
          };
        }
        var currentTaskInDEV = null;
        function getCurrentStackInDEV() {
          {
            if (currentTaskInDEV === null || currentTaskInDEV.componentStack === null) {
              return "";
            }
            return getStackByComponentStackNode(currentTaskInDEV.componentStack);
          }
        }
        function pushBuiltInComponentStackInDEV(task, type) {
          {
            task.componentStack = {
              tag: 0,
              parent: task.componentStack,
              type
            };
          }
        }
        function pushFunctionComponentStackInDEV(task, type) {
          {
            task.componentStack = {
              tag: 1,
              parent: task.componentStack,
              type
            };
          }
        }
        function pushClassComponentStackInDEV(task, type) {
          {
            task.componentStack = {
              tag: 2,
              parent: task.componentStack,
              type
            };
          }
        }
        function popComponentStackInDEV(task) {
          {
            if (task.componentStack === null) {
              error("Unexpectedly popped too many stack frames. This is a bug in React.");
            } else {
              task.componentStack = task.componentStack.parent;
            }
          }
        }
        var lastBoundaryErrorComponentStackDev = null;
        function captureBoundaryErrorDetailsDev(boundary, error2) {
          {
            var errorMessage;
            if (typeof error2 === "string") {
              errorMessage = error2;
            } else if (error2 && typeof error2.message === "string") {
              errorMessage = error2.message;
            } else {
              errorMessage = String(error2);
            }
            var errorComponentStack = lastBoundaryErrorComponentStackDev || getCurrentStackInDEV();
            lastBoundaryErrorComponentStackDev = null;
            boundary.errorMessage = errorMessage;
            boundary.errorComponentStack = errorComponentStack;
          }
        }
        function logRecoverableError(request, error2) {
          var errorDigest = request.onError(error2);
          if (errorDigest != null && typeof errorDigest !== "string") {
            throw new Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof errorDigest + '" instead');
          }
          return errorDigest;
        }
        function fatalError(request, error2) {
          var onShellError = request.onShellError;
          onShellError(error2);
          var onFatalError = request.onFatalError;
          onFatalError(error2);
          if (request.destination !== null) {
            request.status = CLOSED;
            closeWithError(request.destination, error2);
          } else {
            request.status = CLOSING;
            request.fatalError = error2;
          }
        }
        function renderSuspenseBoundary(request, task, props) {
          pushBuiltInComponentStackInDEV(task, "Suspense");
          var parentBoundary = task.blockedBoundary;
          var parentSegment = task.blockedSegment;
          var fallback = props.fallback;
          var content = props.children;
          var fallbackAbortSet = /* @__PURE__ */ new Set();
          var newBoundary = createSuspenseBoundary(request, fallbackAbortSet);
          var insertionIndex = parentSegment.chunks.length;
          var boundarySegment = createPendingSegment(
            request,
            insertionIndex,
            newBoundary,
            parentSegment.formatContext,
            // boundaries never require text embedding at their edges because comment nodes bound them
            false,
            false
          );
          parentSegment.children.push(boundarySegment);
          parentSegment.lastPushedText = false;
          var contentRootSegment = createPendingSegment(
            request,
            0,
            null,
            parentSegment.formatContext,
            // boundaries never require text embedding at their edges because comment nodes bound them
            false,
            false
          );
          contentRootSegment.parentFlushed = true;
          task.blockedBoundary = newBoundary;
          task.blockedSegment = contentRootSegment;
          try {
            renderNode(request, task, content);
            pushSegmentFinale$1(contentRootSegment.chunks, request.responseState, contentRootSegment.lastPushedText, contentRootSegment.textEmbedded);
            contentRootSegment.status = COMPLETED;
            queueCompletedSegment(newBoundary, contentRootSegment);
            if (newBoundary.pendingTasks === 0) {
              popComponentStackInDEV(task);
              return;
            }
          } catch (error2) {
            contentRootSegment.status = ERRORED;
            newBoundary.forceClientRender = true;
            newBoundary.errorDigest = logRecoverableError(request, error2);
            {
              captureBoundaryErrorDetailsDev(newBoundary, error2);
            }
          } finally {
            task.blockedBoundary = parentBoundary;
            task.blockedSegment = parentSegment;
          }
          var suspendedFallbackTask = createTask(request, fallback, parentBoundary, boundarySegment, fallbackAbortSet, task.legacyContext, task.context, task.treeContext);
          {
            suspendedFallbackTask.componentStack = task.componentStack;
          }
          request.pingedTasks.push(suspendedFallbackTask);
          popComponentStackInDEV(task);
        }
        function renderHostElement(request, task, type, props) {
          pushBuiltInComponentStackInDEV(task, type);
          var segment = task.blockedSegment;
          var children = pushStartInstance(segment.chunks, type, props, request.responseState, segment.formatContext);
          segment.lastPushedText = false;
          var prevContext = segment.formatContext;
          segment.formatContext = getChildFormatContext(prevContext, type, props);
          renderNode(request, task, children);
          segment.formatContext = prevContext;
          pushEndInstance(segment.chunks, type);
          segment.lastPushedText = false;
          popComponentStackInDEV(task);
        }
        function shouldConstruct$1(Component) {
          return Component.prototype && Component.prototype.isReactComponent;
        }
        function renderWithHooks(request, task, Component, props, secondArg) {
          var componentIdentity = {};
          prepareToUseHooks(task, componentIdentity);
          var result = Component(props, secondArg);
          return finishHooks(Component, props, result, secondArg);
        }
        function finishClassComponent(request, task, instance, Component, props) {
          var nextChildren = instance.render();
          {
            if (instance.props !== props) {
              if (!didWarnAboutReassigningProps) {
                error("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", getComponentNameFromType(Component) || "a component");
              }
              didWarnAboutReassigningProps = true;
            }
          }
          {
            var childContextTypes = Component.childContextTypes;
            if (childContextTypes !== null && childContextTypes !== void 0) {
              var previousContext = task.legacyContext;
              var mergedContext = processChildContext(instance, Component, previousContext, childContextTypes);
              task.legacyContext = mergedContext;
              renderNodeDestructive(request, task, nextChildren);
              task.legacyContext = previousContext;
              return;
            }
          }
          renderNodeDestructive(request, task, nextChildren);
        }
        function renderClassComponent(request, task, Component, props) {
          pushClassComponentStackInDEV(task, Component);
          var maskedContext = getMaskedContext(Component, task.legacyContext);
          var instance = constructClassInstance(Component, props, maskedContext);
          mountClassInstance(instance, Component, props, maskedContext);
          finishClassComponent(request, task, instance, Component, props);
          popComponentStackInDEV(task);
        }
        var didWarnAboutBadClass = {};
        var didWarnAboutModulePatternComponent = {};
        var didWarnAboutContextTypeOnFunctionComponent = {};
        var didWarnAboutGetDerivedStateOnFunctionComponent = {};
        var didWarnAboutReassigningProps = false;
        var didWarnAboutGenerators = false;
        var didWarnAboutMaps = false;
        var hasWarnedAboutUsingContextAsConsumer = false;
        function renderIndeterminateComponent(request, task, Component, props) {
          var legacyContext;
          {
            legacyContext = getMaskedContext(Component, task.legacyContext);
          }
          pushFunctionComponentStackInDEV(task, Component);
          {
            if (Component.prototype && typeof Component.prototype.render === "function") {
              var componentName = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutBadClass[componentName]) {
                error("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", componentName, componentName);
                didWarnAboutBadClass[componentName] = true;
              }
            }
          }
          var value = renderWithHooks(request, task, Component, props, legacyContext);
          var hasId = checkDidRenderIdHook();
          {
            if (typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0) {
              var _componentName = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutModulePatternComponent[_componentName]) {
                error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName, _componentName, _componentName);
                didWarnAboutModulePatternComponent[_componentName] = true;
              }
            }
          }
          if (
            // Run these checks in production only if the flag is off.
            // Eventually we'll delete this branch altogether.
            typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0
          ) {
            {
              var _componentName2 = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutModulePatternComponent[_componentName2]) {
                error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName2, _componentName2, _componentName2);
                didWarnAboutModulePatternComponent[_componentName2] = true;
              }
            }
            mountClassInstance(value, Component, props, legacyContext);
            finishClassComponent(request, task, value, Component, props);
          } else {
            {
              validateFunctionComponentInDev(Component);
            }
            if (hasId) {
              var prevTreeContext = task.treeContext;
              var totalChildren = 1;
              var index = 0;
              task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
              try {
                renderNodeDestructive(request, task, value);
              } finally {
                task.treeContext = prevTreeContext;
              }
            } else {
              renderNodeDestructive(request, task, value);
            }
          }
          popComponentStackInDEV(task);
        }
        function validateFunctionComponentInDev(Component) {
          {
            if (Component) {
              if (Component.childContextTypes) {
                error("%s(...): childContextTypes cannot be defined on a function component.", Component.displayName || Component.name || "Component");
              }
            }
            if (typeof Component.getDerivedStateFromProps === "function") {
              var _componentName3 = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3]) {
                error("%s: Function components do not support getDerivedStateFromProps.", _componentName3);
                didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3] = true;
              }
            }
            if (typeof Component.contextType === "object" && Component.contextType !== null) {
              var _componentName4 = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutContextTypeOnFunctionComponent[_componentName4]) {
                error("%s: Function components do not support contextType.", _componentName4);
                didWarnAboutContextTypeOnFunctionComponent[_componentName4] = true;
              }
            }
          }
        }
        function resolveDefaultProps(Component, baseProps) {
          if (Component && Component.defaultProps) {
            var props = assign({}, baseProps);
            var defaultProps = Component.defaultProps;
            for (var propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
            return props;
          }
          return baseProps;
        }
        function renderForwardRef(request, task, type, props, ref) {
          pushFunctionComponentStackInDEV(task, type.render);
          var children = renderWithHooks(request, task, type.render, props, ref);
          var hasId = checkDidRenderIdHook();
          if (hasId) {
            var prevTreeContext = task.treeContext;
            var totalChildren = 1;
            var index = 0;
            task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
            try {
              renderNodeDestructive(request, task, children);
            } finally {
              task.treeContext = prevTreeContext;
            }
          } else {
            renderNodeDestructive(request, task, children);
          }
          popComponentStackInDEV(task);
        }
        function renderMemo(request, task, type, props, ref) {
          var innerType = type.type;
          var resolvedProps = resolveDefaultProps(innerType, props);
          renderElement(request, task, innerType, resolvedProps, ref);
        }
        function renderContextConsumer(request, task, context, props) {
          {
            if (context._context === void 0) {
              if (context !== context.Consumer) {
                if (!hasWarnedAboutUsingContextAsConsumer) {
                  hasWarnedAboutUsingContextAsConsumer = true;
                  error("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
                }
              }
            } else {
              context = context._context;
            }
          }
          var render = props.children;
          {
            if (typeof render !== "function") {
              error("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it.");
            }
          }
          var newValue = readContext(context);
          var newChildren = render(newValue);
          renderNodeDestructive(request, task, newChildren);
        }
        function renderContextProvider(request, task, type, props) {
          var context = type._context;
          var value = props.value;
          var children = props.children;
          var prevSnapshot;
          {
            prevSnapshot = task.context;
          }
          task.context = pushProvider(context, value);
          renderNodeDestructive(request, task, children);
          task.context = popProvider(context);
          {
            if (prevSnapshot !== task.context) {
              error("Popping the context provider did not return back to the original snapshot. This is a bug in React.");
            }
          }
        }
        function renderLazyComponent(request, task, lazyComponent, props, ref) {
          pushBuiltInComponentStackInDEV(task, "Lazy");
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;
          var Component = init(payload);
          var resolvedProps = resolveDefaultProps(Component, props);
          renderElement(request, task, Component, resolvedProps, ref);
          popComponentStackInDEV(task);
        }
        function renderElement(request, task, type, props, ref) {
          if (typeof type === "function") {
            if (shouldConstruct$1(type)) {
              renderClassComponent(request, task, type, props);
              return;
            } else {
              renderIndeterminateComponent(request, task, type, props);
              return;
            }
          }
          if (typeof type === "string") {
            renderHostElement(request, task, type, props);
            return;
          }
          switch (type) {
            case REACT_LEGACY_HIDDEN_TYPE:
            case REACT_DEBUG_TRACING_MODE_TYPE:
            case REACT_STRICT_MODE_TYPE:
            case REACT_PROFILER_TYPE:
            case REACT_FRAGMENT_TYPE: {
              renderNodeDestructive(request, task, props.children);
              return;
            }
            case REACT_SUSPENSE_LIST_TYPE: {
              pushBuiltInComponentStackInDEV(task, "SuspenseList");
              renderNodeDestructive(request, task, props.children);
              popComponentStackInDEV(task);
              return;
            }
            case REACT_SCOPE_TYPE: {
              throw new Error("ReactDOMServer does not yet support scope components.");
            }
            case REACT_SUSPENSE_TYPE: {
              {
                renderSuspenseBoundary(request, task, props);
              }
              return;
            }
          }
          if (typeof type === "object" && type !== null) {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE: {
                renderForwardRef(request, task, type, props, ref);
                return;
              }
              case REACT_MEMO_TYPE: {
                renderMemo(request, task, type, props, ref);
                return;
              }
              case REACT_PROVIDER_TYPE: {
                renderContextProvider(request, task, type, props);
                return;
              }
              case REACT_CONTEXT_TYPE: {
                renderContextConsumer(request, task, type, props);
                return;
              }
              case REACT_LAZY_TYPE: {
                renderLazyComponent(request, task, type, props);
                return;
              }
            }
          }
          var info = "";
          {
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
          }
          throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (type == null ? type : typeof type) + "." + info));
        }
        function validateIterable(iterable, iteratorFn) {
          {
            if (typeof Symbol === "function" && // $FlowFixMe Flow doesn't know about toStringTag
            iterable[Symbol.toStringTag] === "Generator") {
              if (!didWarnAboutGenerators) {
                error("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers.");
              }
              didWarnAboutGenerators = true;
            }
            if (iterable.entries === iteratorFn) {
              if (!didWarnAboutMaps) {
                error("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
              }
              didWarnAboutMaps = true;
            }
          }
        }
        function renderNodeDestructive(request, task, node) {
          {
            try {
              return renderNodeDestructiveImpl(request, task, node);
            } catch (x) {
              if (typeof x === "object" && x !== null && typeof x.then === "function") ;
              else {
                lastBoundaryErrorComponentStackDev = lastBoundaryErrorComponentStackDev !== null ? lastBoundaryErrorComponentStackDev : getCurrentStackInDEV();
              }
              throw x;
            }
          }
        }
        function renderNodeDestructiveImpl(request, task, node) {
          task.node = node;
          if (typeof node === "object" && node !== null) {
            switch (node.$$typeof) {
              case REACT_ELEMENT_TYPE: {
                var element = node;
                var type = element.type;
                var props = element.props;
                var ref = element.ref;
                renderElement(request, task, type, props, ref);
                return;
              }
              case REACT_PORTAL_TYPE:
                throw new Error("Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.");
              case REACT_LAZY_TYPE: {
                var lazyNode = node;
                var payload = lazyNode._payload;
                var init = lazyNode._init;
                var resolvedNode;
                {
                  try {
                    resolvedNode = init(payload);
                  } catch (x) {
                    if (typeof x === "object" && x !== null && typeof x.then === "function") {
                      pushBuiltInComponentStackInDEV(task, "Lazy");
                    }
                    throw x;
                  }
                }
                renderNodeDestructive(request, task, resolvedNode);
                return;
              }
            }
            if (isArray(node)) {
              renderChildrenArray(request, task, node);
              return;
            }
            var iteratorFn = getIteratorFn(node);
            if (iteratorFn) {
              {
                validateIterable(node, iteratorFn);
              }
              var iterator = iteratorFn.call(node);
              if (iterator) {
                var step = iterator.next();
                if (!step.done) {
                  var children = [];
                  do {
                    children.push(step.value);
                    step = iterator.next();
                  } while (!step.done);
                  renderChildrenArray(request, task, children);
                  return;
                }
                return;
              }
            }
            var childString = Object.prototype.toString.call(node);
            throw new Error("Objects are not valid as a React child (found: " + (childString === "[object Object]" ? "object with keys {" + Object.keys(node).join(", ") + "}" : childString) + "). If you meant to render a collection of children, use an array instead.");
          }
          if (typeof node === "string") {
            var segment = task.blockedSegment;
            segment.lastPushedText = pushTextInstance$1(task.blockedSegment.chunks, node, request.responseState, segment.lastPushedText);
            return;
          }
          if (typeof node === "number") {
            var _segment = task.blockedSegment;
            _segment.lastPushedText = pushTextInstance$1(task.blockedSegment.chunks, "" + node, request.responseState, _segment.lastPushedText);
            return;
          }
          {
            if (typeof node === "function") {
              error("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
            }
          }
        }
        function renderChildrenArray(request, task, children) {
          var totalChildren = children.length;
          for (var i = 0; i < totalChildren; i++) {
            var prevTreeContext = task.treeContext;
            task.treeContext = pushTreeContext(prevTreeContext, totalChildren, i);
            try {
              renderNode(request, task, children[i]);
            } finally {
              task.treeContext = prevTreeContext;
            }
          }
        }
        function spawnNewSuspendedTask(request, task, x) {
          var segment = task.blockedSegment;
          var insertionIndex = segment.chunks.length;
          var newSegment = createPendingSegment(
            request,
            insertionIndex,
            null,
            segment.formatContext,
            // Adopt the parent segment's leading text embed
            segment.lastPushedText,
            // Assume we are text embedded at the trailing edge
            true
          );
          segment.children.push(newSegment);
          segment.lastPushedText = false;
          var newTask = createTask(request, task.node, task.blockedBoundary, newSegment, task.abortSet, task.legacyContext, task.context, task.treeContext);
          {
            if (task.componentStack !== null) {
              newTask.componentStack = task.componentStack.parent;
            }
          }
          var ping = newTask.ping;
          x.then(ping, ping);
        }
        function renderNode(request, task, node) {
          var previousFormatContext = task.blockedSegment.formatContext;
          var previousLegacyContext = task.legacyContext;
          var previousContext = task.context;
          var previousComponentStack = null;
          {
            previousComponentStack = task.componentStack;
          }
          try {
            return renderNodeDestructive(request, task, node);
          } catch (x) {
            resetHooksState();
            if (typeof x === "object" && x !== null && typeof x.then === "function") {
              spawnNewSuspendedTask(request, task, x);
              task.blockedSegment.formatContext = previousFormatContext;
              task.legacyContext = previousLegacyContext;
              task.context = previousContext;
              switchContext(previousContext);
              {
                task.componentStack = previousComponentStack;
              }
              return;
            } else {
              task.blockedSegment.formatContext = previousFormatContext;
              task.legacyContext = previousLegacyContext;
              task.context = previousContext;
              switchContext(previousContext);
              {
                task.componentStack = previousComponentStack;
              }
              throw x;
            }
          }
        }
        function erroredTask(request, boundary, segment, error2) {
          var errorDigest = logRecoverableError(request, error2);
          if (boundary === null) {
            fatalError(request, error2);
          } else {
            boundary.pendingTasks--;
            if (!boundary.forceClientRender) {
              boundary.forceClientRender = true;
              boundary.errorDigest = errorDigest;
              {
                captureBoundaryErrorDetailsDev(boundary, error2);
              }
              if (boundary.parentFlushed) {
                request.clientRenderedBoundaries.push(boundary);
              }
            }
          }
          request.allPendingTasks--;
          if (request.allPendingTasks === 0) {
            var onAllReady = request.onAllReady;
            onAllReady();
          }
        }
        function abortTaskSoft(task) {
          var request = this;
          var boundary = task.blockedBoundary;
          var segment = task.blockedSegment;
          segment.status = ABORTED;
          finishedTask(request, boundary, segment);
        }
        function abortTask(task, request, reason) {
          var boundary = task.blockedBoundary;
          var segment = task.blockedSegment;
          segment.status = ABORTED;
          if (boundary === null) {
            request.allPendingTasks--;
            if (request.status !== CLOSED) {
              request.status = CLOSED;
              if (request.destination !== null) {
                close(request.destination);
              }
            }
          } else {
            boundary.pendingTasks--;
            if (!boundary.forceClientRender) {
              boundary.forceClientRender = true;
              var _error = reason === void 0 ? new Error("The render was aborted by the server without a reason.") : reason;
              boundary.errorDigest = request.onError(_error);
              {
                var errorPrefix = "The server did not finish this Suspense boundary: ";
                if (_error && typeof _error.message === "string") {
                  _error = errorPrefix + _error.message;
                } else {
                  _error = errorPrefix + String(_error);
                }
                var previousTaskInDev = currentTaskInDEV;
                currentTaskInDEV = task;
                try {
                  captureBoundaryErrorDetailsDev(boundary, _error);
                } finally {
                  currentTaskInDEV = previousTaskInDev;
                }
              }
              if (boundary.parentFlushed) {
                request.clientRenderedBoundaries.push(boundary);
              }
            }
            boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
              return abortTask(fallbackTask, request, reason);
            });
            boundary.fallbackAbortableTasks.clear();
            request.allPendingTasks--;
            if (request.allPendingTasks === 0) {
              var onAllReady = request.onAllReady;
              onAllReady();
            }
          }
        }
        function queueCompletedSegment(boundary, segment) {
          if (segment.chunks.length === 0 && segment.children.length === 1 && segment.children[0].boundary === null) {
            var childSegment = segment.children[0];
            childSegment.id = segment.id;
            childSegment.parentFlushed = true;
            if (childSegment.status === COMPLETED) {
              queueCompletedSegment(boundary, childSegment);
            }
          } else {
            var completedSegments = boundary.completedSegments;
            completedSegments.push(segment);
          }
        }
        function finishedTask(request, boundary, segment) {
          if (boundary === null) {
            if (segment.parentFlushed) {
              if (request.completedRootSegment !== null) {
                throw new Error("There can only be one root segment. This is a bug in React.");
              }
              request.completedRootSegment = segment;
            }
            request.pendingRootTasks--;
            if (request.pendingRootTasks === 0) {
              request.onShellError = noop$1;
              var onShellReady = request.onShellReady;
              onShellReady();
            }
          } else {
            boundary.pendingTasks--;
            if (boundary.forceClientRender) ;
            else if (boundary.pendingTasks === 0) {
              if (segment.parentFlushed) {
                if (segment.status === COMPLETED) {
                  queueCompletedSegment(boundary, segment);
                }
              }
              if (boundary.parentFlushed) {
                request.completedBoundaries.push(boundary);
              }
              boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request);
              boundary.fallbackAbortableTasks.clear();
            } else {
              if (segment.parentFlushed) {
                if (segment.status === COMPLETED) {
                  queueCompletedSegment(boundary, segment);
                  var completedSegments = boundary.completedSegments;
                  if (completedSegments.length === 1) {
                    if (boundary.parentFlushed) {
                      request.partialBoundaries.push(boundary);
                    }
                  }
                }
              }
            }
          }
          request.allPendingTasks--;
          if (request.allPendingTasks === 0) {
            var onAllReady = request.onAllReady;
            onAllReady();
          }
        }
        function retryTask(request, task) {
          var segment = task.blockedSegment;
          if (segment.status !== PENDING) {
            return;
          }
          switchContext(task.context);
          var prevTaskInDEV = null;
          {
            prevTaskInDEV = currentTaskInDEV;
            currentTaskInDEV = task;
          }
          try {
            renderNodeDestructive(request, task, task.node);
            pushSegmentFinale$1(segment.chunks, request.responseState, segment.lastPushedText, segment.textEmbedded);
            task.abortSet.delete(task);
            segment.status = COMPLETED;
            finishedTask(request, task.blockedBoundary, segment);
          } catch (x) {
            resetHooksState();
            if (typeof x === "object" && x !== null && typeof x.then === "function") {
              var ping = task.ping;
              x.then(ping, ping);
            } else {
              task.abortSet.delete(task);
              segment.status = ERRORED;
              erroredTask(request, task.blockedBoundary, segment, x);
            }
          } finally {
            {
              currentTaskInDEV = prevTaskInDEV;
            }
          }
        }
        function performWork(request) {
          if (request.status === CLOSED) {
            return;
          }
          var prevContext = getActiveContext();
          var prevDispatcher = ReactCurrentDispatcher$1.current;
          ReactCurrentDispatcher$1.current = Dispatcher;
          var prevGetCurrentStackImpl;
          {
            prevGetCurrentStackImpl = ReactDebugCurrentFrame$1.getCurrentStack;
            ReactDebugCurrentFrame$1.getCurrentStack = getCurrentStackInDEV;
          }
          var prevResponseState = currentResponseState;
          setCurrentResponseState(request.responseState);
          try {
            var pingedTasks = request.pingedTasks;
            var i;
            for (i = 0; i < pingedTasks.length; i++) {
              var task = pingedTasks[i];
              retryTask(request, task);
            }
            pingedTasks.splice(0, i);
            if (request.destination !== null) {
              flushCompletedQueues(request, request.destination);
            }
          } catch (error2) {
            logRecoverableError(request, error2);
            fatalError(request, error2);
          } finally {
            setCurrentResponseState(prevResponseState);
            ReactCurrentDispatcher$1.current = prevDispatcher;
            {
              ReactDebugCurrentFrame$1.getCurrentStack = prevGetCurrentStackImpl;
            }
            if (prevDispatcher === Dispatcher) {
              switchContext(prevContext);
            }
          }
        }
        function flushSubtree(request, destination, segment) {
          segment.parentFlushed = true;
          switch (segment.status) {
            case PENDING: {
              var segmentID = segment.id = request.nextSegmentId++;
              segment.lastPushedText = false;
              segment.textEmbedded = false;
              return writePlaceholder(destination, request.responseState, segmentID);
            }
            case COMPLETED: {
              segment.status = FLUSHED;
              var r = true;
              var chunks = segment.chunks;
              var chunkIdx = 0;
              var children = segment.children;
              for (var childIdx = 0; childIdx < children.length; childIdx++) {
                var nextChild = children[childIdx];
                for (; chunkIdx < nextChild.index; chunkIdx++) {
                  writeChunk(destination, chunks[chunkIdx]);
                }
                r = flushSegment(request, destination, nextChild);
              }
              for (; chunkIdx < chunks.length - 1; chunkIdx++) {
                writeChunk(destination, chunks[chunkIdx]);
              }
              if (chunkIdx < chunks.length) {
                r = writeChunkAndReturn(destination, chunks[chunkIdx]);
              }
              return r;
            }
            default: {
              throw new Error("Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.");
            }
          }
        }
        function flushSegment(request, destination, segment) {
          var boundary = segment.boundary;
          if (boundary === null) {
            return flushSubtree(request, destination, segment);
          }
          boundary.parentFlushed = true;
          if (boundary.forceClientRender) {
            writeStartClientRenderedSuspenseBoundary$1(destination, request.responseState, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
            flushSubtree(request, destination, segment);
            return writeEndClientRenderedSuspenseBoundary$1(destination, request.responseState);
          } else if (boundary.pendingTasks > 0) {
            boundary.rootSegmentID = request.nextSegmentId++;
            if (boundary.completedSegments.length > 0) {
              request.partialBoundaries.push(boundary);
            }
            var id = boundary.id = assignSuspenseBoundaryID(request.responseState);
            writeStartPendingSuspenseBoundary(destination, request.responseState, id);
            flushSubtree(request, destination, segment);
            return writeEndPendingSuspenseBoundary(destination, request.responseState);
          } else if (boundary.byteSize > request.progressiveChunkSize) {
            boundary.rootSegmentID = request.nextSegmentId++;
            request.completedBoundaries.push(boundary);
            writeStartPendingSuspenseBoundary(destination, request.responseState, boundary.id);
            flushSubtree(request, destination, segment);
            return writeEndPendingSuspenseBoundary(destination, request.responseState);
          } else {
            writeStartCompletedSuspenseBoundary$1(destination, request.responseState);
            var completedSegments = boundary.completedSegments;
            if (completedSegments.length !== 1) {
              throw new Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
            }
            var contentSegment = completedSegments[0];
            flushSegment(request, destination, contentSegment);
            return writeEndCompletedSuspenseBoundary$1(destination, request.responseState);
          }
        }
        function flushClientRenderedBoundary(request, destination, boundary) {
          return writeClientRenderBoundaryInstruction(destination, request.responseState, boundary.id, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
        }
        function flushSegmentContainer(request, destination, segment) {
          writeStartSegment(destination, request.responseState, segment.formatContext, segment.id);
          flushSegment(request, destination, segment);
          return writeEndSegment(destination, segment.formatContext);
        }
        function flushCompletedBoundary(request, destination, boundary) {
          var completedSegments = boundary.completedSegments;
          var i = 0;
          for (; i < completedSegments.length; i++) {
            var segment = completedSegments[i];
            flushPartiallyCompletedSegment(request, destination, boundary, segment);
          }
          completedSegments.length = 0;
          return writeCompletedBoundaryInstruction(destination, request.responseState, boundary.id, boundary.rootSegmentID);
        }
        function flushPartialBoundary(request, destination, boundary) {
          var completedSegments = boundary.completedSegments;
          var i = 0;
          for (; i < completedSegments.length; i++) {
            var segment = completedSegments[i];
            if (!flushPartiallyCompletedSegment(request, destination, boundary, segment)) {
              i++;
              completedSegments.splice(0, i);
              return false;
            }
          }
          completedSegments.splice(0, i);
          return true;
        }
        function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
          if (segment.status === FLUSHED) {
            return true;
          }
          var segmentID = segment.id;
          if (segmentID === -1) {
            var rootSegmentID = segment.id = boundary.rootSegmentID;
            if (rootSegmentID === -1) {
              throw new Error("A root segment ID must have been assigned by now. This is a bug in React.");
            }
            return flushSegmentContainer(request, destination, segment);
          } else {
            flushSegmentContainer(request, destination, segment);
            return writeCompletedSegmentInstruction(destination, request.responseState, segmentID);
          }
        }
        function flushCompletedQueues(request, destination) {
          try {
            var completedRootSegment = request.completedRootSegment;
            if (completedRootSegment !== null && request.pendingRootTasks === 0) {
              flushSegment(request, destination, completedRootSegment);
              request.completedRootSegment = null;
              writeCompletedRoot(destination, request.responseState);
            }
            var clientRenderedBoundaries = request.clientRenderedBoundaries;
            var i;
            for (i = 0; i < clientRenderedBoundaries.length; i++) {
              var boundary = clientRenderedBoundaries[i];
              if (!flushClientRenderedBoundary(request, destination, boundary)) {
                request.destination = null;
                i++;
                clientRenderedBoundaries.splice(0, i);
                return;
              }
            }
            clientRenderedBoundaries.splice(0, i);
            var completedBoundaries = request.completedBoundaries;
            for (i = 0; i < completedBoundaries.length; i++) {
              var _boundary = completedBoundaries[i];
              if (!flushCompletedBoundary(request, destination, _boundary)) {
                request.destination = null;
                i++;
                completedBoundaries.splice(0, i);
                return;
              }
            }
            completedBoundaries.splice(0, i);
            completeWriting(destination);
            beginWriting(destination);
            var partialBoundaries = request.partialBoundaries;
            for (i = 0; i < partialBoundaries.length; i++) {
              var _boundary2 = partialBoundaries[i];
              if (!flushPartialBoundary(request, destination, _boundary2)) {
                request.destination = null;
                i++;
                partialBoundaries.splice(0, i);
                return;
              }
            }
            partialBoundaries.splice(0, i);
            var largeBoundaries = request.completedBoundaries;
            for (i = 0; i < largeBoundaries.length; i++) {
              var _boundary3 = largeBoundaries[i];
              if (!flushCompletedBoundary(request, destination, _boundary3)) {
                request.destination = null;
                i++;
                largeBoundaries.splice(0, i);
                return;
              }
            }
            largeBoundaries.splice(0, i);
          } finally {
            if (request.allPendingTasks === 0 && request.pingedTasks.length === 0 && request.clientRenderedBoundaries.length === 0 && request.completedBoundaries.length === 0) {
              {
                if (request.abortableTasks.size !== 0) {
                  error("There was still abortable task at the root when we closed. This is a bug in React.");
                }
              }
              close(destination);
            }
          }
        }
        function startWork(request) {
          scheduleWork(function() {
            return performWork(request);
          });
        }
        function startFlowing(request, destination) {
          if (request.status === CLOSING) {
            request.status = CLOSED;
            closeWithError(destination, request.fatalError);
            return;
          }
          if (request.status === CLOSED) {
            return;
          }
          if (request.destination !== null) {
            return;
          }
          request.destination = destination;
          try {
            flushCompletedQueues(request, destination);
          } catch (error2) {
            logRecoverableError(request, error2);
            fatalError(request, error2);
          }
        }
        function abort(request, reason) {
          try {
            var abortableTasks = request.abortableTasks;
            abortableTasks.forEach(function(task) {
              return abortTask(task, request, reason);
            });
            abortableTasks.clear();
            if (request.destination !== null) {
              flushCompletedQueues(request, request.destination);
            }
          } catch (error2) {
            logRecoverableError(request, error2);
            fatalError(request, error2);
          }
        }
        function onError() {
        }
        function renderToStringImpl(children, options, generateStaticMarkup, abortReason) {
          var didFatal = false;
          var fatalError2 = null;
          var result = "";
          var destination = {
            push: function(chunk) {
              if (chunk !== null) {
                result += chunk;
              }
              return true;
            },
            destroy: function(error2) {
              didFatal = true;
              fatalError2 = error2;
            }
          };
          var readyToStream = false;
          function onShellReady() {
            readyToStream = true;
          }
          var request = createRequest(children, createResponseState$1(generateStaticMarkup, options ? options.identifierPrefix : void 0), createRootFormatContext(), Infinity, onError, void 0, onShellReady, void 0, void 0);
          startWork(request);
          abort(request, abortReason);
          startFlowing(request, destination);
          if (didFatal) {
            throw fatalError2;
          }
          if (!readyToStream) {
            throw new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          }
          return result;
        }
        function renderToString(children, options) {
          return renderToStringImpl(children, options, false, 'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server');
        }
        function renderToStaticMarkup(children, options) {
          return renderToStringImpl(children, options, true, 'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server');
        }
        function renderToNodeStream() {
          throw new Error("ReactDOMServer.renderToNodeStream(): The streaming API is not available in the browser. Use ReactDOMServer.renderToString() instead.");
        }
        function renderToStaticNodeStream() {
          throw new Error("ReactDOMServer.renderToStaticNodeStream(): The streaming API is not available in the browser. Use ReactDOMServer.renderToStaticMarkup() instead.");
        }
        exports.renderToNodeStream = renderToNodeStream;
        exports.renderToStaticMarkup = renderToStaticMarkup;
        exports.renderToStaticNodeStream = renderToStaticNodeStream;
        exports.renderToString = renderToString;
        exports.version = ReactVersion;
      })();
    }
  }
});

// node_modules/react-dom/cjs/react-dom-server.browser.development.js
var require_react_dom_server_browser_development = __commonJS({
  "node_modules/react-dom/cjs/react-dom-server.browser.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        var React = require_react();
        var ReactVersion = "18.2.0";
        var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function warn(format) {
          {
            {
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              printWarning("warn", format, args);
            }
          }
        }
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        function scheduleWork(callback) {
          callback();
        }
        var VIEW_SIZE = 512;
        var currentView = null;
        var writtenBytes = 0;
        function beginWriting(destination) {
          currentView = new Uint8Array(VIEW_SIZE);
          writtenBytes = 0;
        }
        function writeChunk(destination, chunk) {
          if (chunk.length === 0) {
            return;
          }
          if (chunk.length > VIEW_SIZE) {
            if (writtenBytes > 0) {
              destination.enqueue(new Uint8Array(currentView.buffer, 0, writtenBytes));
              currentView = new Uint8Array(VIEW_SIZE);
              writtenBytes = 0;
            }
            destination.enqueue(chunk);
            return;
          }
          var bytesToWrite = chunk;
          var allowableBytes = currentView.length - writtenBytes;
          if (allowableBytes < bytesToWrite.length) {
            if (allowableBytes === 0) {
              destination.enqueue(currentView);
            } else {
              currentView.set(bytesToWrite.subarray(0, allowableBytes), writtenBytes);
              destination.enqueue(currentView);
              bytesToWrite = bytesToWrite.subarray(allowableBytes);
            }
            currentView = new Uint8Array(VIEW_SIZE);
            writtenBytes = 0;
          }
          currentView.set(bytesToWrite, writtenBytes);
          writtenBytes += bytesToWrite.length;
        }
        function writeChunkAndReturn(destination, chunk) {
          writeChunk(destination, chunk);
          return true;
        }
        function completeWriting(destination) {
          if (currentView && writtenBytes > 0) {
            destination.enqueue(new Uint8Array(currentView.buffer, 0, writtenBytes));
            currentView = null;
            writtenBytes = 0;
          }
        }
        function close(destination) {
          destination.close();
        }
        var textEncoder = new TextEncoder();
        function stringToChunk(content) {
          return textEncoder.encode(content);
        }
        function stringToPrecomputedChunk(content) {
          return textEncoder.encode(content);
        }
        function closeWithError(destination, error2) {
          if (typeof destination.error === "function") {
            destination.error(error2);
          } else {
            destination.close();
          }
        }
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e) {
              return true;
            }
          }
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkAttributeStringCoercion(value, attributeName) {
          {
            if (willCoercionThrow(value)) {
              error("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", attributeName, typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        function checkCSSPropertyStringCoercion(value, propName) {
          {
            if (willCoercionThrow(value)) {
              error("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", propName, typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        function checkHtmlStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var RESERVED = 0;
        var STRING = 1;
        var BOOLEANISH_STRING = 2;
        var BOOLEAN = 3;
        var OVERLOADED_BOOLEAN = 4;
        var NUMERIC = 5;
        var POSITIVE_NUMERIC = 6;
        var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
        var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
        var VALID_ATTRIBUTE_NAME_REGEX = new RegExp("^[" + ATTRIBUTE_NAME_START_CHAR + "][" + ATTRIBUTE_NAME_CHAR + "]*$");
        var illegalAttributeNameCache = {};
        var validatedAttributeNameCache = {};
        function isAttributeNameSafe(attributeName) {
          if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) {
            return true;
          }
          if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) {
            return false;
          }
          if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
            validatedAttributeNameCache[attributeName] = true;
            return true;
          }
          illegalAttributeNameCache[attributeName] = true;
          {
            error("Invalid attribute name: `%s`", attributeName);
          }
          return false;
        }
        function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
          if (propertyInfo !== null && propertyInfo.type === RESERVED) {
            return false;
          }
          switch (typeof value) {
            case "function":
            case "symbol":
              return true;
            case "boolean": {
              if (isCustomComponentTag) {
                return false;
              }
              if (propertyInfo !== null) {
                return !propertyInfo.acceptsBooleans;
              } else {
                var prefix2 = name.toLowerCase().slice(0, 5);
                return prefix2 !== "data-" && prefix2 !== "aria-";
              }
            }
            default:
              return false;
          }
        }
        function getPropertyInfo(name) {
          return properties.hasOwnProperty(name) ? properties[name] : null;
        }
        function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL2, removeEmptyString) {
          this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
          this.attributeName = attributeName;
          this.attributeNamespace = attributeNamespace;
          this.mustUseProperty = mustUseProperty;
          this.propertyName = name;
          this.type = type;
          this.sanitizeURL = sanitizeURL2;
          this.removeEmptyString = removeEmptyString;
        }
        var properties = {};
        var reservedProps = [
          "children",
          "dangerouslySetInnerHTML",
          // TODO: This prevents the assignment of defaultValue to regular
          // elements (not just inputs). Now that ReactDOMInput assigns to the
          // defaultValue property -- do we need this?
          "defaultValue",
          "defaultChecked",
          "innerHTML",
          "suppressContentEditableWarning",
          "suppressHydrationWarning",
          "style"
        ];
        reservedProps.forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            RESERVED,
            false,
            // mustUseProperty
            name,
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(_ref) {
          var name = _ref[0], attributeName = _ref[1];
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            // mustUseProperty
            attributeName,
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEANISH_STRING,
            false,
            // mustUseProperty
            name.toLowerCase(),
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEANISH_STRING,
            false,
            // mustUseProperty
            name,
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        [
          "allowFullScreen",
          "async",
          // Note: there is a special case that prevents it from being written to the DOM
          // on the client side because the browsers are inconsistent. Instead we call focus().
          "autoFocus",
          "autoPlay",
          "controls",
          "default",
          "defer",
          "disabled",
          "disablePictureInPicture",
          "disableRemotePlayback",
          "formNoValidate",
          "hidden",
          "loop",
          "noModule",
          "noValidate",
          "open",
          "playsInline",
          "readOnly",
          "required",
          "reversed",
          "scoped",
          "seamless",
          // Microdata
          "itemScope"
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEAN,
            false,
            // mustUseProperty
            name.toLowerCase(),
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        [
          "checked",
          // Note: `option.selected` is not updated if `select.multiple` is
          // disabled with `removeAttribute`. We have special logic for handling this.
          "multiple",
          "muted",
          "selected"
          // NOTE: if you add a camelCased prop to this list,
          // you'll need to set attributeName to name.toLowerCase()
          // instead in the assignment below.
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            BOOLEAN,
            true,
            // mustUseProperty
            name,
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        [
          "capture",
          "download"
          // NOTE: if you add a camelCased prop to this list,
          // you'll need to set attributeName to name.toLowerCase()
          // instead in the assignment below.
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            OVERLOADED_BOOLEAN,
            false,
            // mustUseProperty
            name,
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        [
          "cols",
          "rows",
          "size",
          "span"
          // NOTE: if you add a camelCased prop to this list,
          // you'll need to set attributeName to name.toLowerCase()
          // instead in the assignment below.
        ].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            POSITIVE_NUMERIC,
            false,
            // mustUseProperty
            name,
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        ["rowSpan", "start"].forEach(function(name) {
          properties[name] = new PropertyInfoRecord(
            name,
            NUMERIC,
            false,
            // mustUseProperty
            name.toLowerCase(),
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        var CAMELIZE = /[\-\:]([a-z])/g;
        var capitalize = function(token) {
          return token[1].toUpperCase();
        };
        [
          "accent-height",
          "alignment-baseline",
          "arabic-form",
          "baseline-shift",
          "cap-height",
          "clip-path",
          "clip-rule",
          "color-interpolation",
          "color-interpolation-filters",
          "color-profile",
          "color-rendering",
          "dominant-baseline",
          "enable-background",
          "fill-opacity",
          "fill-rule",
          "flood-color",
          "flood-opacity",
          "font-family",
          "font-size",
          "font-size-adjust",
          "font-stretch",
          "font-style",
          "font-variant",
          "font-weight",
          "glyph-name",
          "glyph-orientation-horizontal",
          "glyph-orientation-vertical",
          "horiz-adv-x",
          "horiz-origin-x",
          "image-rendering",
          "letter-spacing",
          "lighting-color",
          "marker-end",
          "marker-mid",
          "marker-start",
          "overline-position",
          "overline-thickness",
          "paint-order",
          "panose-1",
          "pointer-events",
          "rendering-intent",
          "shape-rendering",
          "stop-color",
          "stop-opacity",
          "strikethrough-position",
          "strikethrough-thickness",
          "stroke-dasharray",
          "stroke-dashoffset",
          "stroke-linecap",
          "stroke-linejoin",
          "stroke-miterlimit",
          "stroke-opacity",
          "stroke-width",
          "text-anchor",
          "text-decoration",
          "text-rendering",
          "underline-position",
          "underline-thickness",
          "unicode-bidi",
          "unicode-range",
          "units-per-em",
          "v-alphabetic",
          "v-hanging",
          "v-ideographic",
          "v-mathematical",
          "vector-effect",
          "vert-adv-y",
          "vert-origin-x",
          "vert-origin-y",
          "word-spacing",
          "writing-mode",
          "xmlns:xlink",
          "x-height"
          // NOTE: if you add a camelCased prop to this list,
          // you'll need to set attributeName to name.toLowerCase()
          // instead in the assignment below.
        ].forEach(function(attributeName) {
          var name = attributeName.replace(CAMELIZE, capitalize);
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            // mustUseProperty
            attributeName,
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        [
          "xlink:actuate",
          "xlink:arcrole",
          "xlink:role",
          "xlink:show",
          "xlink:title",
          "xlink:type"
          // NOTE: if you add a camelCased prop to this list,
          // you'll need to set attributeName to name.toLowerCase()
          // instead in the assignment below.
        ].forEach(function(attributeName) {
          var name = attributeName.replace(CAMELIZE, capitalize);
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            // mustUseProperty
            attributeName,
            "http://www.w3.org/1999/xlink",
            false,
            // sanitizeURL
            false
          );
        });
        [
          "xml:base",
          "xml:lang",
          "xml:space"
          // NOTE: if you add a camelCased prop to this list,
          // you'll need to set attributeName to name.toLowerCase()
          // instead in the assignment below.
        ].forEach(function(attributeName) {
          var name = attributeName.replace(CAMELIZE, capitalize);
          properties[name] = new PropertyInfoRecord(
            name,
            STRING,
            false,
            // mustUseProperty
            attributeName,
            "http://www.w3.org/XML/1998/namespace",
            false,
            // sanitizeURL
            false
          );
        });
        ["tabIndex", "crossOrigin"].forEach(function(attributeName) {
          properties[attributeName] = new PropertyInfoRecord(
            attributeName,
            STRING,
            false,
            // mustUseProperty
            attributeName.toLowerCase(),
            // attributeName
            null,
            // attributeNamespace
            false,
            // sanitizeURL
            false
          );
        });
        var xlinkHref = "xlinkHref";
        properties[xlinkHref] = new PropertyInfoRecord(
          "xlinkHref",
          STRING,
          false,
          // mustUseProperty
          "xlink:href",
          "http://www.w3.org/1999/xlink",
          true,
          // sanitizeURL
          false
        );
        ["src", "href", "action", "formAction"].forEach(function(attributeName) {
          properties[attributeName] = new PropertyInfoRecord(
            attributeName,
            STRING,
            false,
            // mustUseProperty
            attributeName.toLowerCase(),
            // attributeName
            null,
            // attributeNamespace
            true,
            // sanitizeURL
            true
          );
        });
        var isUnitlessNumber = {
          animationIterationCount: true,
          aspectRatio: true,
          borderImageOutset: true,
          borderImageSlice: true,
          borderImageWidth: true,
          boxFlex: true,
          boxFlexGroup: true,
          boxOrdinalGroup: true,
          columnCount: true,
          columns: true,
          flex: true,
          flexGrow: true,
          flexPositive: true,
          flexShrink: true,
          flexNegative: true,
          flexOrder: true,
          gridArea: true,
          gridRow: true,
          gridRowEnd: true,
          gridRowSpan: true,
          gridRowStart: true,
          gridColumn: true,
          gridColumnEnd: true,
          gridColumnSpan: true,
          gridColumnStart: true,
          fontWeight: true,
          lineClamp: true,
          lineHeight: true,
          opacity: true,
          order: true,
          orphans: true,
          tabSize: true,
          widows: true,
          zIndex: true,
          zoom: true,
          // SVG-related properties
          fillOpacity: true,
          floodOpacity: true,
          stopOpacity: true,
          strokeDasharray: true,
          strokeDashoffset: true,
          strokeMiterlimit: true,
          strokeOpacity: true,
          strokeWidth: true
        };
        function prefixKey(prefix2, key) {
          return prefix2 + key.charAt(0).toUpperCase() + key.substring(1);
        }
        var prefixes = ["Webkit", "ms", "Moz", "O"];
        Object.keys(isUnitlessNumber).forEach(function(prop) {
          prefixes.forEach(function(prefix2) {
            isUnitlessNumber[prefixKey(prefix2, prop)] = isUnitlessNumber[prop];
          });
        });
        var hasReadOnlyValue = {
          button: true,
          checkbox: true,
          image: true,
          hidden: true,
          radio: true,
          reset: true,
          submit: true
        };
        function checkControlledValueProps(tagName, props) {
          {
            if (!(hasReadOnlyValue[props.type] || props.onChange || props.onInput || props.readOnly || props.disabled || props.value == null)) {
              error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.");
            }
            if (!(props.onChange || props.readOnly || props.disabled || props.checked == null)) {
              error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
            }
          }
        }
        function isCustomComponent(tagName, props) {
          if (tagName.indexOf("-") === -1) {
            return typeof props.is === "string";
          }
          switch (tagName) {
            case "annotation-xml":
            case "color-profile":
            case "font-face":
            case "font-face-src":
            case "font-face-uri":
            case "font-face-format":
            case "font-face-name":
            case "missing-glyph":
              return false;
            default:
              return true;
          }
        }
        var ariaProperties = {
          "aria-current": 0,
          // state
          "aria-description": 0,
          "aria-details": 0,
          "aria-disabled": 0,
          // state
          "aria-hidden": 0,
          // state
          "aria-invalid": 0,
          // state
          "aria-keyshortcuts": 0,
          "aria-label": 0,
          "aria-roledescription": 0,
          // Widget Attributes
          "aria-autocomplete": 0,
          "aria-checked": 0,
          "aria-expanded": 0,
          "aria-haspopup": 0,
          "aria-level": 0,
          "aria-modal": 0,
          "aria-multiline": 0,
          "aria-multiselectable": 0,
          "aria-orientation": 0,
          "aria-placeholder": 0,
          "aria-pressed": 0,
          "aria-readonly": 0,
          "aria-required": 0,
          "aria-selected": 0,
          "aria-sort": 0,
          "aria-valuemax": 0,
          "aria-valuemin": 0,
          "aria-valuenow": 0,
          "aria-valuetext": 0,
          // Live Region Attributes
          "aria-atomic": 0,
          "aria-busy": 0,
          "aria-live": 0,
          "aria-relevant": 0,
          // Drag-and-Drop Attributes
          "aria-dropeffect": 0,
          "aria-grabbed": 0,
          // Relationship Attributes
          "aria-activedescendant": 0,
          "aria-colcount": 0,
          "aria-colindex": 0,
          "aria-colspan": 0,
          "aria-controls": 0,
          "aria-describedby": 0,
          "aria-errormessage": 0,
          "aria-flowto": 0,
          "aria-labelledby": 0,
          "aria-owns": 0,
          "aria-posinset": 0,
          "aria-rowcount": 0,
          "aria-rowindex": 0,
          "aria-rowspan": 0,
          "aria-setsize": 0
        };
        var warnedProperties = {};
        var rARIA = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
        var rARIACamel = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
        function validateProperty(tagName, name) {
          {
            if (hasOwnProperty.call(warnedProperties, name) && warnedProperties[name]) {
              return true;
            }
            if (rARIACamel.test(name)) {
              var ariaName = "aria-" + name.slice(4).toLowerCase();
              var correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;
              if (correctName == null) {
                error("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", name);
                warnedProperties[name] = true;
                return true;
              }
              if (name !== correctName) {
                error("Invalid ARIA attribute `%s`. Did you mean `%s`?", name, correctName);
                warnedProperties[name] = true;
                return true;
              }
            }
            if (rARIA.test(name)) {
              var lowerCasedName = name.toLowerCase();
              var standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;
              if (standardName == null) {
                warnedProperties[name] = true;
                return false;
              }
              if (name !== standardName) {
                error("Unknown ARIA attribute `%s`. Did you mean `%s`?", name, standardName);
                warnedProperties[name] = true;
                return true;
              }
            }
          }
          return true;
        }
        function warnInvalidARIAProps(type, props) {
          {
            var invalidProps = [];
            for (var key in props) {
              var isValid = validateProperty(type, key);
              if (!isValid) {
                invalidProps.push(key);
              }
            }
            var unknownPropString = invalidProps.map(function(prop) {
              return "`" + prop + "`";
            }).join(", ");
            if (invalidProps.length === 1) {
              error("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
            } else if (invalidProps.length > 1) {
              error("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
            }
          }
        }
        function validateProperties(type, props) {
          if (isCustomComponent(type, props)) {
            return;
          }
          warnInvalidARIAProps(type, props);
        }
        var didWarnValueNull = false;
        function validateProperties$1(type, props) {
          {
            if (type !== "input" && type !== "textarea" && type !== "select") {
              return;
            }
            if (props != null && props.value === null && !didWarnValueNull) {
              didWarnValueNull = true;
              if (type === "select" && props.multiple) {
                error("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", type);
              } else {
                error("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", type);
              }
            }
          }
        }
        var possibleStandardNames = {
          // HTML
          accept: "accept",
          acceptcharset: "acceptCharset",
          "accept-charset": "acceptCharset",
          accesskey: "accessKey",
          action: "action",
          allowfullscreen: "allowFullScreen",
          alt: "alt",
          as: "as",
          async: "async",
          autocapitalize: "autoCapitalize",
          autocomplete: "autoComplete",
          autocorrect: "autoCorrect",
          autofocus: "autoFocus",
          autoplay: "autoPlay",
          autosave: "autoSave",
          capture: "capture",
          cellpadding: "cellPadding",
          cellspacing: "cellSpacing",
          challenge: "challenge",
          charset: "charSet",
          checked: "checked",
          children: "children",
          cite: "cite",
          class: "className",
          classid: "classID",
          classname: "className",
          cols: "cols",
          colspan: "colSpan",
          content: "content",
          contenteditable: "contentEditable",
          contextmenu: "contextMenu",
          controls: "controls",
          controlslist: "controlsList",
          coords: "coords",
          crossorigin: "crossOrigin",
          dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
          data: "data",
          datetime: "dateTime",
          default: "default",
          defaultchecked: "defaultChecked",
          defaultvalue: "defaultValue",
          defer: "defer",
          dir: "dir",
          disabled: "disabled",
          disablepictureinpicture: "disablePictureInPicture",
          disableremoteplayback: "disableRemotePlayback",
          download: "download",
          draggable: "draggable",
          enctype: "encType",
          enterkeyhint: "enterKeyHint",
          for: "htmlFor",
          form: "form",
          formmethod: "formMethod",
          formaction: "formAction",
          formenctype: "formEncType",
          formnovalidate: "formNoValidate",
          formtarget: "formTarget",
          frameborder: "frameBorder",
          headers: "headers",
          height: "height",
          hidden: "hidden",
          high: "high",
          href: "href",
          hreflang: "hrefLang",
          htmlfor: "htmlFor",
          httpequiv: "httpEquiv",
          "http-equiv": "httpEquiv",
          icon: "icon",
          id: "id",
          imagesizes: "imageSizes",
          imagesrcset: "imageSrcSet",
          innerhtml: "innerHTML",
          inputmode: "inputMode",
          integrity: "integrity",
          is: "is",
          itemid: "itemID",
          itemprop: "itemProp",
          itemref: "itemRef",
          itemscope: "itemScope",
          itemtype: "itemType",
          keyparams: "keyParams",
          keytype: "keyType",
          kind: "kind",
          label: "label",
          lang: "lang",
          list: "list",
          loop: "loop",
          low: "low",
          manifest: "manifest",
          marginwidth: "marginWidth",
          marginheight: "marginHeight",
          max: "max",
          maxlength: "maxLength",
          media: "media",
          mediagroup: "mediaGroup",
          method: "method",
          min: "min",
          minlength: "minLength",
          multiple: "multiple",
          muted: "muted",
          name: "name",
          nomodule: "noModule",
          nonce: "nonce",
          novalidate: "noValidate",
          open: "open",
          optimum: "optimum",
          pattern: "pattern",
          placeholder: "placeholder",
          playsinline: "playsInline",
          poster: "poster",
          preload: "preload",
          profile: "profile",
          radiogroup: "radioGroup",
          readonly: "readOnly",
          referrerpolicy: "referrerPolicy",
          rel: "rel",
          required: "required",
          reversed: "reversed",
          role: "role",
          rows: "rows",
          rowspan: "rowSpan",
          sandbox: "sandbox",
          scope: "scope",
          scoped: "scoped",
          scrolling: "scrolling",
          seamless: "seamless",
          selected: "selected",
          shape: "shape",
          size: "size",
          sizes: "sizes",
          span: "span",
          spellcheck: "spellCheck",
          src: "src",
          srcdoc: "srcDoc",
          srclang: "srcLang",
          srcset: "srcSet",
          start: "start",
          step: "step",
          style: "style",
          summary: "summary",
          tabindex: "tabIndex",
          target: "target",
          title: "title",
          type: "type",
          usemap: "useMap",
          value: "value",
          width: "width",
          wmode: "wmode",
          wrap: "wrap",
          // SVG
          about: "about",
          accentheight: "accentHeight",
          "accent-height": "accentHeight",
          accumulate: "accumulate",
          additive: "additive",
          alignmentbaseline: "alignmentBaseline",
          "alignment-baseline": "alignmentBaseline",
          allowreorder: "allowReorder",
          alphabetic: "alphabetic",
          amplitude: "amplitude",
          arabicform: "arabicForm",
          "arabic-form": "arabicForm",
          ascent: "ascent",
          attributename: "attributeName",
          attributetype: "attributeType",
          autoreverse: "autoReverse",
          azimuth: "azimuth",
          basefrequency: "baseFrequency",
          baselineshift: "baselineShift",
          "baseline-shift": "baselineShift",
          baseprofile: "baseProfile",
          bbox: "bbox",
          begin: "begin",
          bias: "bias",
          by: "by",
          calcmode: "calcMode",
          capheight: "capHeight",
          "cap-height": "capHeight",
          clip: "clip",
          clippath: "clipPath",
          "clip-path": "clipPath",
          clippathunits: "clipPathUnits",
          cliprule: "clipRule",
          "clip-rule": "clipRule",
          color: "color",
          colorinterpolation: "colorInterpolation",
          "color-interpolation": "colorInterpolation",
          colorinterpolationfilters: "colorInterpolationFilters",
          "color-interpolation-filters": "colorInterpolationFilters",
          colorprofile: "colorProfile",
          "color-profile": "colorProfile",
          colorrendering: "colorRendering",
          "color-rendering": "colorRendering",
          contentscripttype: "contentScriptType",
          contentstyletype: "contentStyleType",
          cursor: "cursor",
          cx: "cx",
          cy: "cy",
          d: "d",
          datatype: "datatype",
          decelerate: "decelerate",
          descent: "descent",
          diffuseconstant: "diffuseConstant",
          direction: "direction",
          display: "display",
          divisor: "divisor",
          dominantbaseline: "dominantBaseline",
          "dominant-baseline": "dominantBaseline",
          dur: "dur",
          dx: "dx",
          dy: "dy",
          edgemode: "edgeMode",
          elevation: "elevation",
          enablebackground: "enableBackground",
          "enable-background": "enableBackground",
          end: "end",
          exponent: "exponent",
          externalresourcesrequired: "externalResourcesRequired",
          fill: "fill",
          fillopacity: "fillOpacity",
          "fill-opacity": "fillOpacity",
          fillrule: "fillRule",
          "fill-rule": "fillRule",
          filter: "filter",
          filterres: "filterRes",
          filterunits: "filterUnits",
          floodopacity: "floodOpacity",
          "flood-opacity": "floodOpacity",
          floodcolor: "floodColor",
          "flood-color": "floodColor",
          focusable: "focusable",
          fontfamily: "fontFamily",
          "font-family": "fontFamily",
          fontsize: "fontSize",
          "font-size": "fontSize",
          fontsizeadjust: "fontSizeAdjust",
          "font-size-adjust": "fontSizeAdjust",
          fontstretch: "fontStretch",
          "font-stretch": "fontStretch",
          fontstyle: "fontStyle",
          "font-style": "fontStyle",
          fontvariant: "fontVariant",
          "font-variant": "fontVariant",
          fontweight: "fontWeight",
          "font-weight": "fontWeight",
          format: "format",
          from: "from",
          fx: "fx",
          fy: "fy",
          g1: "g1",
          g2: "g2",
          glyphname: "glyphName",
          "glyph-name": "glyphName",
          glyphorientationhorizontal: "glyphOrientationHorizontal",
          "glyph-orientation-horizontal": "glyphOrientationHorizontal",
          glyphorientationvertical: "glyphOrientationVertical",
          "glyph-orientation-vertical": "glyphOrientationVertical",
          glyphref: "glyphRef",
          gradienttransform: "gradientTransform",
          gradientunits: "gradientUnits",
          hanging: "hanging",
          horizadvx: "horizAdvX",
          "horiz-adv-x": "horizAdvX",
          horizoriginx: "horizOriginX",
          "horiz-origin-x": "horizOriginX",
          ideographic: "ideographic",
          imagerendering: "imageRendering",
          "image-rendering": "imageRendering",
          in2: "in2",
          in: "in",
          inlist: "inlist",
          intercept: "intercept",
          k1: "k1",
          k2: "k2",
          k3: "k3",
          k4: "k4",
          k: "k",
          kernelmatrix: "kernelMatrix",
          kernelunitlength: "kernelUnitLength",
          kerning: "kerning",
          keypoints: "keyPoints",
          keysplines: "keySplines",
          keytimes: "keyTimes",
          lengthadjust: "lengthAdjust",
          letterspacing: "letterSpacing",
          "letter-spacing": "letterSpacing",
          lightingcolor: "lightingColor",
          "lighting-color": "lightingColor",
          limitingconeangle: "limitingConeAngle",
          local: "local",
          markerend: "markerEnd",
          "marker-end": "markerEnd",
          markerheight: "markerHeight",
          markermid: "markerMid",
          "marker-mid": "markerMid",
          markerstart: "markerStart",
          "marker-start": "markerStart",
          markerunits: "markerUnits",
          markerwidth: "markerWidth",
          mask: "mask",
          maskcontentunits: "maskContentUnits",
          maskunits: "maskUnits",
          mathematical: "mathematical",
          mode: "mode",
          numoctaves: "numOctaves",
          offset: "offset",
          opacity: "opacity",
          operator: "operator",
          order: "order",
          orient: "orient",
          orientation: "orientation",
          origin: "origin",
          overflow: "overflow",
          overlineposition: "overlinePosition",
          "overline-position": "overlinePosition",
          overlinethickness: "overlineThickness",
          "overline-thickness": "overlineThickness",
          paintorder: "paintOrder",
          "paint-order": "paintOrder",
          panose1: "panose1",
          "panose-1": "panose1",
          pathlength: "pathLength",
          patterncontentunits: "patternContentUnits",
          patterntransform: "patternTransform",
          patternunits: "patternUnits",
          pointerevents: "pointerEvents",
          "pointer-events": "pointerEvents",
          points: "points",
          pointsatx: "pointsAtX",
          pointsaty: "pointsAtY",
          pointsatz: "pointsAtZ",
          prefix: "prefix",
          preservealpha: "preserveAlpha",
          preserveaspectratio: "preserveAspectRatio",
          primitiveunits: "primitiveUnits",
          property: "property",
          r: "r",
          radius: "radius",
          refx: "refX",
          refy: "refY",
          renderingintent: "renderingIntent",
          "rendering-intent": "renderingIntent",
          repeatcount: "repeatCount",
          repeatdur: "repeatDur",
          requiredextensions: "requiredExtensions",
          requiredfeatures: "requiredFeatures",
          resource: "resource",
          restart: "restart",
          result: "result",
          results: "results",
          rotate: "rotate",
          rx: "rx",
          ry: "ry",
          scale: "scale",
          security: "security",
          seed: "seed",
          shaperendering: "shapeRendering",
          "shape-rendering": "shapeRendering",
          slope: "slope",
          spacing: "spacing",
          specularconstant: "specularConstant",
          specularexponent: "specularExponent",
          speed: "speed",
          spreadmethod: "spreadMethod",
          startoffset: "startOffset",
          stddeviation: "stdDeviation",
          stemh: "stemh",
          stemv: "stemv",
          stitchtiles: "stitchTiles",
          stopcolor: "stopColor",
          "stop-color": "stopColor",
          stopopacity: "stopOpacity",
          "stop-opacity": "stopOpacity",
          strikethroughposition: "strikethroughPosition",
          "strikethrough-position": "strikethroughPosition",
          strikethroughthickness: "strikethroughThickness",
          "strikethrough-thickness": "strikethroughThickness",
          string: "string",
          stroke: "stroke",
          strokedasharray: "strokeDasharray",
          "stroke-dasharray": "strokeDasharray",
          strokedashoffset: "strokeDashoffset",
          "stroke-dashoffset": "strokeDashoffset",
          strokelinecap: "strokeLinecap",
          "stroke-linecap": "strokeLinecap",
          strokelinejoin: "strokeLinejoin",
          "stroke-linejoin": "strokeLinejoin",
          strokemiterlimit: "strokeMiterlimit",
          "stroke-miterlimit": "strokeMiterlimit",
          strokewidth: "strokeWidth",
          "stroke-width": "strokeWidth",
          strokeopacity: "strokeOpacity",
          "stroke-opacity": "strokeOpacity",
          suppresscontenteditablewarning: "suppressContentEditableWarning",
          suppresshydrationwarning: "suppressHydrationWarning",
          surfacescale: "surfaceScale",
          systemlanguage: "systemLanguage",
          tablevalues: "tableValues",
          targetx: "targetX",
          targety: "targetY",
          textanchor: "textAnchor",
          "text-anchor": "textAnchor",
          textdecoration: "textDecoration",
          "text-decoration": "textDecoration",
          textlength: "textLength",
          textrendering: "textRendering",
          "text-rendering": "textRendering",
          to: "to",
          transform: "transform",
          typeof: "typeof",
          u1: "u1",
          u2: "u2",
          underlineposition: "underlinePosition",
          "underline-position": "underlinePosition",
          underlinethickness: "underlineThickness",
          "underline-thickness": "underlineThickness",
          unicode: "unicode",
          unicodebidi: "unicodeBidi",
          "unicode-bidi": "unicodeBidi",
          unicoderange: "unicodeRange",
          "unicode-range": "unicodeRange",
          unitsperem: "unitsPerEm",
          "units-per-em": "unitsPerEm",
          unselectable: "unselectable",
          valphabetic: "vAlphabetic",
          "v-alphabetic": "vAlphabetic",
          values: "values",
          vectoreffect: "vectorEffect",
          "vector-effect": "vectorEffect",
          version: "version",
          vertadvy: "vertAdvY",
          "vert-adv-y": "vertAdvY",
          vertoriginx: "vertOriginX",
          "vert-origin-x": "vertOriginX",
          vertoriginy: "vertOriginY",
          "vert-origin-y": "vertOriginY",
          vhanging: "vHanging",
          "v-hanging": "vHanging",
          videographic: "vIdeographic",
          "v-ideographic": "vIdeographic",
          viewbox: "viewBox",
          viewtarget: "viewTarget",
          visibility: "visibility",
          vmathematical: "vMathematical",
          "v-mathematical": "vMathematical",
          vocab: "vocab",
          widths: "widths",
          wordspacing: "wordSpacing",
          "word-spacing": "wordSpacing",
          writingmode: "writingMode",
          "writing-mode": "writingMode",
          x1: "x1",
          x2: "x2",
          x: "x",
          xchannelselector: "xChannelSelector",
          xheight: "xHeight",
          "x-height": "xHeight",
          xlinkactuate: "xlinkActuate",
          "xlink:actuate": "xlinkActuate",
          xlinkarcrole: "xlinkArcrole",
          "xlink:arcrole": "xlinkArcrole",
          xlinkhref: "xlinkHref",
          "xlink:href": "xlinkHref",
          xlinkrole: "xlinkRole",
          "xlink:role": "xlinkRole",
          xlinkshow: "xlinkShow",
          "xlink:show": "xlinkShow",
          xlinktitle: "xlinkTitle",
          "xlink:title": "xlinkTitle",
          xlinktype: "xlinkType",
          "xlink:type": "xlinkType",
          xmlbase: "xmlBase",
          "xml:base": "xmlBase",
          xmllang: "xmlLang",
          "xml:lang": "xmlLang",
          xmlns: "xmlns",
          "xml:space": "xmlSpace",
          xmlnsxlink: "xmlnsXlink",
          "xmlns:xlink": "xmlnsXlink",
          xmlspace: "xmlSpace",
          y1: "y1",
          y2: "y2",
          y: "y",
          ychannelselector: "yChannelSelector",
          z: "z",
          zoomandpan: "zoomAndPan"
        };
        var validateProperty$1 = function() {
        };
        {
          var warnedProperties$1 = {};
          var EVENT_NAME_REGEX = /^on./;
          var INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/;
          var rARIA$1 = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
          var rARIACamel$1 = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
          validateProperty$1 = function(tagName, name, value, eventRegistry) {
            if (hasOwnProperty.call(warnedProperties$1, name) && warnedProperties$1[name]) {
              return true;
            }
            var lowerCasedName = name.toLowerCase();
            if (lowerCasedName === "onfocusin" || lowerCasedName === "onfocusout") {
              error("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React.");
              warnedProperties$1[name] = true;
              return true;
            }
            if (eventRegistry != null) {
              var registrationNameDependencies = eventRegistry.registrationNameDependencies, possibleRegistrationNames = eventRegistry.possibleRegistrationNames;
              if (registrationNameDependencies.hasOwnProperty(name)) {
                return true;
              }
              var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
              if (registrationName != null) {
                error("Invalid event handler property `%s`. Did you mean `%s`?", name, registrationName);
                warnedProperties$1[name] = true;
                return true;
              }
              if (EVENT_NAME_REGEX.test(name)) {
                error("Unknown event handler property `%s`. It will be ignored.", name);
                warnedProperties$1[name] = true;
                return true;
              }
            } else if (EVENT_NAME_REGEX.test(name)) {
              if (INVALID_EVENT_NAME_REGEX.test(name)) {
                error("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", name);
              }
              warnedProperties$1[name] = true;
              return true;
            }
            if (rARIA$1.test(name) || rARIACamel$1.test(name)) {
              return true;
            }
            if (lowerCasedName === "innerhtml") {
              error("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`.");
              warnedProperties$1[name] = true;
              return true;
            }
            if (lowerCasedName === "aria") {
              error("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead.");
              warnedProperties$1[name] = true;
              return true;
            }
            if (lowerCasedName === "is" && value !== null && value !== void 0 && typeof value !== "string") {
              error("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof value);
              warnedProperties$1[name] = true;
              return true;
            }
            if (typeof value === "number" && isNaN(value)) {
              error("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", name);
              warnedProperties$1[name] = true;
              return true;
            }
            var propertyInfo = getPropertyInfo(name);
            var isReserved = propertyInfo !== null && propertyInfo.type === RESERVED;
            if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
              var standardName = possibleStandardNames[lowerCasedName];
              if (standardName !== name) {
                error("Invalid DOM property `%s`. Did you mean `%s`?", name, standardName);
                warnedProperties$1[name] = true;
                return true;
              }
            } else if (!isReserved && name !== lowerCasedName) {
              error("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", name, lowerCasedName);
              warnedProperties$1[name] = true;
              return true;
            }
            if (typeof value === "boolean" && shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
              if (value) {
                error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', value, name, name, value, name);
              } else {
                error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', value, name, name, value, name, name, name);
              }
              warnedProperties$1[name] = true;
              return true;
            }
            if (isReserved) {
              return true;
            }
            if (shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
              warnedProperties$1[name] = true;
              return false;
            }
            if ((value === "false" || value === "true") && propertyInfo !== null && propertyInfo.type === BOOLEAN) {
              error("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", value, name, value === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', name, value);
              warnedProperties$1[name] = true;
              return true;
            }
            return true;
          };
        }
        var warnUnknownProperties = function(type, props, eventRegistry) {
          {
            var unknownProps = [];
            for (var key in props) {
              var isValid = validateProperty$1(type, key, props[key], eventRegistry);
              if (!isValid) {
                unknownProps.push(key);
              }
            }
            var unknownPropString = unknownProps.map(function(prop) {
              return "`" + prop + "`";
            }).join(", ");
            if (unknownProps.length === 1) {
              error("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
            } else if (unknownProps.length > 1) {
              error("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
            }
          }
        };
        function validateProperties$2(type, props, eventRegistry) {
          if (isCustomComponent(type, props)) {
            return;
          }
          warnUnknownProperties(type, props, eventRegistry);
        }
        var warnValidStyle = function() {
        };
        {
          var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
          var msPattern = /^-ms-/;
          var hyphenPattern = /-(.)/g;
          var badStyleValueWithSemicolonPattern = /;\s*$/;
          var warnedStyleNames = {};
          var warnedStyleValues = {};
          var warnedForNaNValue = false;
          var warnedForInfinityValue = false;
          var camelize = function(string) {
            return string.replace(hyphenPattern, function(_, character) {
              return character.toUpperCase();
            });
          };
          var warnHyphenatedStyleName = function(name) {
            if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
              return;
            }
            warnedStyleNames[name] = true;
            error(
              "Unsupported style property %s. Did you mean %s?",
              name,
              // As Andi Smith suggests
              // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
              // is converted to lowercase `ms`.
              camelize(name.replace(msPattern, "ms-"))
            );
          };
          var warnBadVendoredStyleName = function(name) {
            if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
              return;
            }
            warnedStyleNames[name] = true;
            error("Unsupported vendor-prefixed style property %s. Did you mean %s?", name, name.charAt(0).toUpperCase() + name.slice(1));
          };
          var warnStyleValueWithSemicolon = function(name, value) {
            if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
              return;
            }
            warnedStyleValues[value] = true;
            error(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, name, value.replace(badStyleValueWithSemicolonPattern, ""));
          };
          var warnStyleValueIsNaN = function(name, value) {
            if (warnedForNaNValue) {
              return;
            }
            warnedForNaNValue = true;
            error("`NaN` is an invalid value for the `%s` css style property.", name);
          };
          var warnStyleValueIsInfinity = function(name, value) {
            if (warnedForInfinityValue) {
              return;
            }
            warnedForInfinityValue = true;
            error("`Infinity` is an invalid value for the `%s` css style property.", name);
          };
          warnValidStyle = function(name, value) {
            if (name.indexOf("-") > -1) {
              warnHyphenatedStyleName(name);
            } else if (badVendoredStyleNamePattern.test(name)) {
              warnBadVendoredStyleName(name);
            } else if (badStyleValueWithSemicolonPattern.test(value)) {
              warnStyleValueWithSemicolon(name, value);
            }
            if (typeof value === "number") {
              if (isNaN(value)) {
                warnStyleValueIsNaN(name, value);
              } else if (!isFinite(value)) {
                warnStyleValueIsInfinity(name, value);
              }
            }
          };
        }
        var warnValidStyle$1 = warnValidStyle;
        var matchHtmlRegExp = /["'&<>]/;
        function escapeHtml(string) {
          {
            checkHtmlStringCoercion(string);
          }
          var str = "" + string;
          var match = matchHtmlRegExp.exec(str);
          if (!match) {
            return str;
          }
          var escape;
          var html = "";
          var index;
          var lastIndex = 0;
          for (index = match.index; index < str.length; index++) {
            switch (str.charCodeAt(index)) {
              case 34:
                escape = "&quot;";
                break;
              case 38:
                escape = "&amp;";
                break;
              case 39:
                escape = "&#x27;";
                break;
              case 60:
                escape = "&lt;";
                break;
              case 62:
                escape = "&gt;";
                break;
              default:
                continue;
            }
            if (lastIndex !== index) {
              html += str.substring(lastIndex, index);
            }
            lastIndex = index + 1;
            html += escape;
          }
          return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
        }
        function escapeTextForBrowser(text) {
          if (typeof text === "boolean" || typeof text === "number") {
            return "" + text;
          }
          return escapeHtml(text);
        }
        var uppercasePattern = /([A-Z])/g;
        var msPattern$1 = /^ms-/;
        function hyphenateStyleName(name) {
          return name.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern$1, "-ms-");
        }
        var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;
        var didWarn = false;
        function sanitizeURL(url) {
          {
            if (!didWarn && isJavaScriptProtocol.test(url)) {
              didWarn = true;
              error("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(url));
            }
          }
        }
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        var startInlineScript = stringToPrecomputedChunk("<script>");
        var endInlineScript = stringToPrecomputedChunk("<\/script>");
        var startScriptSrc = stringToPrecomputedChunk('<script src="');
        var startModuleSrc = stringToPrecomputedChunk('<script type="module" src="');
        var endAsyncScript = stringToPrecomputedChunk('" async=""><\/script>');
        function escapeBootstrapScriptContent(scriptText) {
          {
            checkHtmlStringCoercion(scriptText);
          }
          return ("" + scriptText).replace(scriptRegex, scriptReplacer);
        }
        var scriptRegex = /(<\/|<)(s)(cript)/gi;
        var scriptReplacer = function(match, prefix2, s, suffix) {
          return "" + prefix2 + (s === "s" ? "\\u0073" : "\\u0053") + suffix;
        };
        function createResponseState(identifierPrefix, nonce, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
          var idPrefix = identifierPrefix === void 0 ? "" : identifierPrefix;
          var inlineScriptWithNonce = nonce === void 0 ? startInlineScript : stringToPrecomputedChunk('<script nonce="' + escapeTextForBrowser(nonce) + '">');
          var bootstrapChunks = [];
          if (bootstrapScriptContent !== void 0) {
            bootstrapChunks.push(inlineScriptWithNonce, stringToChunk(escapeBootstrapScriptContent(bootstrapScriptContent)), endInlineScript);
          }
          if (bootstrapScripts !== void 0) {
            for (var i = 0; i < bootstrapScripts.length; i++) {
              bootstrapChunks.push(startScriptSrc, stringToChunk(escapeTextForBrowser(bootstrapScripts[i])), endAsyncScript);
            }
          }
          if (bootstrapModules !== void 0) {
            for (var _i = 0; _i < bootstrapModules.length; _i++) {
              bootstrapChunks.push(startModuleSrc, stringToChunk(escapeTextForBrowser(bootstrapModules[_i])), endAsyncScript);
            }
          }
          return {
            bootstrapChunks,
            startInlineScript: inlineScriptWithNonce,
            placeholderPrefix: stringToPrecomputedChunk(idPrefix + "P:"),
            segmentPrefix: stringToPrecomputedChunk(idPrefix + "S:"),
            boundaryPrefix: idPrefix + "B:",
            idPrefix,
            nextSuspenseID: 0,
            sentCompleteSegmentFunction: false,
            sentCompleteBoundaryFunction: false,
            sentClientRenderFunction: false
          };
        }
        var ROOT_HTML_MODE = 0;
        var HTML_MODE = 1;
        var SVG_MODE = 2;
        var MATHML_MODE = 3;
        var HTML_TABLE_MODE = 4;
        var HTML_TABLE_BODY_MODE = 5;
        var HTML_TABLE_ROW_MODE = 6;
        var HTML_COLGROUP_MODE = 7;
        function createFormatContext(insertionMode, selectedValue) {
          return {
            insertionMode,
            selectedValue
          };
        }
        function createRootFormatContext(namespaceURI) {
          var insertionMode = namespaceURI === "http://www.w3.org/2000/svg" ? SVG_MODE : namespaceURI === "http://www.w3.org/1998/Math/MathML" ? MATHML_MODE : ROOT_HTML_MODE;
          return createFormatContext(insertionMode, null);
        }
        function getChildFormatContext(parentContext, type, props) {
          switch (type) {
            case "select":
              return createFormatContext(HTML_MODE, props.value != null ? props.value : props.defaultValue);
            case "svg":
              return createFormatContext(SVG_MODE, null);
            case "math":
              return createFormatContext(MATHML_MODE, null);
            case "foreignObject":
              return createFormatContext(HTML_MODE, null);
            case "table":
              return createFormatContext(HTML_TABLE_MODE, null);
            case "thead":
            case "tbody":
            case "tfoot":
              return createFormatContext(HTML_TABLE_BODY_MODE, null);
            case "colgroup":
              return createFormatContext(HTML_COLGROUP_MODE, null);
            case "tr":
              return createFormatContext(HTML_TABLE_ROW_MODE, null);
          }
          if (parentContext.insertionMode >= HTML_TABLE_MODE) {
            return createFormatContext(HTML_MODE, null);
          }
          if (parentContext.insertionMode === ROOT_HTML_MODE) {
            return createFormatContext(HTML_MODE, null);
          }
          return parentContext;
        }
        var UNINITIALIZED_SUSPENSE_BOUNDARY_ID = null;
        function assignSuspenseBoundaryID(responseState) {
          var generatedID = responseState.nextSuspenseID++;
          return stringToPrecomputedChunk(responseState.boundaryPrefix + generatedID.toString(16));
        }
        function makeId(responseState, treeId, localId) {
          var idPrefix = responseState.idPrefix;
          var id = ":" + idPrefix + "R" + treeId;
          if (localId > 0) {
            id += "H" + localId.toString(32);
          }
          return id + ":";
        }
        function encodeHTMLTextNode(text) {
          return escapeTextForBrowser(text);
        }
        var textSeparator = stringToPrecomputedChunk("<!-- -->");
        function pushTextInstance(target, text, responseState, textEmbedded) {
          if (text === "") {
            return textEmbedded;
          }
          if (textEmbedded) {
            target.push(textSeparator);
          }
          target.push(stringToChunk(encodeHTMLTextNode(text)));
          return true;
        }
        function pushSegmentFinale(target, responseState, lastPushedText, textEmbedded) {
          if (lastPushedText && textEmbedded) {
            target.push(textSeparator);
          }
        }
        var styleNameCache = /* @__PURE__ */ new Map();
        function processStyleName(styleName) {
          var chunk = styleNameCache.get(styleName);
          if (chunk !== void 0) {
            return chunk;
          }
          var result = stringToPrecomputedChunk(escapeTextForBrowser(hyphenateStyleName(styleName)));
          styleNameCache.set(styleName, result);
          return result;
        }
        var styleAttributeStart = stringToPrecomputedChunk(' style="');
        var styleAssign = stringToPrecomputedChunk(":");
        var styleSeparator = stringToPrecomputedChunk(";");
        function pushStyle(target, responseState, style) {
          if (typeof style !== "object") {
            throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
          }
          var isFirst = true;
          for (var styleName in style) {
            if (!hasOwnProperty.call(style, styleName)) {
              continue;
            }
            var styleValue = style[styleName];
            if (styleValue == null || typeof styleValue === "boolean" || styleValue === "") {
              continue;
            }
            var nameChunk = void 0;
            var valueChunk = void 0;
            var isCustomProperty = styleName.indexOf("--") === 0;
            if (isCustomProperty) {
              nameChunk = stringToChunk(escapeTextForBrowser(styleName));
              {
                checkCSSPropertyStringCoercion(styleValue, styleName);
              }
              valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
            } else {
              {
                warnValidStyle$1(styleName, styleValue);
              }
              nameChunk = processStyleName(styleName);
              if (typeof styleValue === "number") {
                if (styleValue !== 0 && !hasOwnProperty.call(isUnitlessNumber, styleName)) {
                  valueChunk = stringToChunk(styleValue + "px");
                } else {
                  valueChunk = stringToChunk("" + styleValue);
                }
              } else {
                {
                  checkCSSPropertyStringCoercion(styleValue, styleName);
                }
                valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
              }
            }
            if (isFirst) {
              isFirst = false;
              target.push(styleAttributeStart, nameChunk, styleAssign, valueChunk);
            } else {
              target.push(styleSeparator, nameChunk, styleAssign, valueChunk);
            }
          }
          if (!isFirst) {
            target.push(attributeEnd);
          }
        }
        var attributeSeparator = stringToPrecomputedChunk(" ");
        var attributeAssign = stringToPrecomputedChunk('="');
        var attributeEnd = stringToPrecomputedChunk('"');
        var attributeEmptyString = stringToPrecomputedChunk('=""');
        function pushAttribute(target, responseState, name, value) {
          switch (name) {
            case "style": {
              pushStyle(target, responseState, value);
              return;
            }
            case "defaultValue":
            case "defaultChecked":
            case "innerHTML":
            case "suppressContentEditableWarning":
            case "suppressHydrationWarning":
              return;
          }
          if (
            // shouldIgnoreAttribute
            // We have already filtered out null/undefined and reserved words.
            name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N")
          ) {
            return;
          }
          var propertyInfo = getPropertyInfo(name);
          if (propertyInfo !== null) {
            switch (typeof value) {
              case "function":
              case "symbol":
                return;
              case "boolean": {
                if (!propertyInfo.acceptsBooleans) {
                  return;
                }
              }
            }
            var attributeName = propertyInfo.attributeName;
            var attributeNameChunk = stringToChunk(attributeName);
            switch (propertyInfo.type) {
              case BOOLEAN:
                if (value) {
                  target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
                }
                return;
              case OVERLOADED_BOOLEAN:
                if (value === true) {
                  target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
                } else if (value === false) ;
                else {
                  target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                }
                return;
              case NUMERIC:
                if (!isNaN(value)) {
                  target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                }
                break;
              case POSITIVE_NUMERIC:
                if (!isNaN(value) && value >= 1) {
                  target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                }
                break;
              default:
                if (propertyInfo.sanitizeURL) {
                  {
                    checkAttributeStringCoercion(value, attributeName);
                  }
                  value = "" + value;
                  sanitizeURL(value);
                }
                target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
            }
          } else if (isAttributeNameSafe(name)) {
            switch (typeof value) {
              case "function":
              case "symbol":
                return;
              case "boolean": {
                var prefix2 = name.toLowerCase().slice(0, 5);
                if (prefix2 !== "data-" && prefix2 !== "aria-") {
                  return;
                }
              }
            }
            target.push(attributeSeparator, stringToChunk(name), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
          }
        }
        var endOfStartTag = stringToPrecomputedChunk(">");
        var endOfStartTagSelfClosing = stringToPrecomputedChunk("/>");
        function pushInnerHTML(target, innerHTML, children) {
          if (innerHTML != null) {
            if (children != null) {
              throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
            }
            if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
              throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
            }
            var html = innerHTML.__html;
            if (html !== null && html !== void 0) {
              {
                checkHtmlStringCoercion(html);
              }
              target.push(stringToChunk("" + html));
            }
          }
        }
        var didWarnDefaultInputValue = false;
        var didWarnDefaultChecked = false;
        var didWarnDefaultSelectValue = false;
        var didWarnDefaultTextareaValue = false;
        var didWarnInvalidOptionChildren = false;
        var didWarnInvalidOptionInnerHTML = false;
        var didWarnSelectedSetOnOption = false;
        function checkSelectProp(props, propName) {
          {
            var value = props[propName];
            if (value != null) {
              var array = isArray(value);
              if (props.multiple && !array) {
                error("The `%s` prop supplied to <select> must be an array if `multiple` is true.", propName);
              } else if (!props.multiple && array) {
                error("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.", propName);
              }
            }
          }
        }
        function pushStartSelect(target, props, responseState) {
          {
            checkControlledValueProps("select", props);
            checkSelectProp(props, "value");
            checkSelectProp(props, "defaultValue");
            if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultSelectValue) {
              error("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components");
              didWarnDefaultSelectValue = true;
            }
          }
          target.push(startChunkForTag("select"));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "defaultValue":
                case "value":
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          return children;
        }
        function flattenOptionChildren(children) {
          var content = "";
          React.Children.forEach(children, function(child) {
            if (child == null) {
              return;
            }
            content += child;
            {
              if (!didWarnInvalidOptionChildren && typeof child !== "string" && typeof child !== "number") {
                didWarnInvalidOptionChildren = true;
                error("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.");
              }
            }
          });
          return content;
        }
        var selectedMarkerAttribute = stringToPrecomputedChunk(' selected=""');
        function pushStartOption(target, props, responseState, formatContext) {
          var selectedValue = formatContext.selectedValue;
          target.push(startChunkForTag("option"));
          var children = null;
          var value = null;
          var selected = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "selected":
                  selected = propValue;
                  {
                    if (!didWarnSelectedSetOnOption) {
                      error("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>.");
                      didWarnSelectedSetOnOption = true;
                    }
                  }
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "value":
                  value = propValue;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          if (selectedValue != null) {
            var stringValue;
            if (value !== null) {
              {
                checkAttributeStringCoercion(value, "value");
              }
              stringValue = "" + value;
            } else {
              {
                if (innerHTML !== null) {
                  if (!didWarnInvalidOptionInnerHTML) {
                    didWarnInvalidOptionInnerHTML = true;
                    error("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.");
                  }
                }
              }
              stringValue = flattenOptionChildren(children);
            }
            if (isArray(selectedValue)) {
              for (var i = 0; i < selectedValue.length; i++) {
                {
                  checkAttributeStringCoercion(selectedValue[i], "value");
                }
                var v = "" + selectedValue[i];
                if (v === stringValue) {
                  target.push(selectedMarkerAttribute);
                  break;
                }
              }
            } else {
              {
                checkAttributeStringCoercion(selectedValue, "select.value");
              }
              if ("" + selectedValue === stringValue) {
                target.push(selectedMarkerAttribute);
              }
            }
          } else if (selected) {
            target.push(selectedMarkerAttribute);
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          return children;
        }
        function pushInput(target, props, responseState) {
          {
            checkControlledValueProps("input", props);
            if (props.checked !== void 0 && props.defaultChecked !== void 0 && !didWarnDefaultChecked) {
              error("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
              didWarnDefaultChecked = true;
            }
            if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultInputValue) {
              error("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
              didWarnDefaultInputValue = true;
            }
          }
          target.push(startChunkForTag("input"));
          var value = null;
          var defaultValue = null;
          var checked = null;
          var defaultChecked = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw new Error("input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
                case "defaultChecked":
                  defaultChecked = propValue;
                  break;
                case "defaultValue":
                  defaultValue = propValue;
                  break;
                case "checked":
                  checked = propValue;
                  break;
                case "value":
                  value = propValue;
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          if (checked !== null) {
            pushAttribute(target, responseState, "checked", checked);
          } else if (defaultChecked !== null) {
            pushAttribute(target, responseState, "checked", defaultChecked);
          }
          if (value !== null) {
            pushAttribute(target, responseState, "value", value);
          } else if (defaultValue !== null) {
            pushAttribute(target, responseState, "value", defaultValue);
          }
          target.push(endOfStartTagSelfClosing);
          return null;
        }
        function pushStartTextArea(target, props, responseState) {
          {
            checkControlledValueProps("textarea", props);
            if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultTextareaValue) {
              error("Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components");
              didWarnDefaultTextareaValue = true;
            }
          }
          target.push(startChunkForTag("textarea"));
          var value = null;
          var defaultValue = null;
          var children = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "value":
                  value = propValue;
                  break;
                case "defaultValue":
                  defaultValue = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          if (value === null && defaultValue !== null) {
            value = defaultValue;
          }
          target.push(endOfStartTag);
          if (children != null) {
            {
              error("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
            }
            if (value != null) {
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            }
            if (isArray(children)) {
              if (children.length > 1) {
                throw new Error("<textarea> can only have at most one child.");
              }
              {
                checkHtmlStringCoercion(children[0]);
              }
              value = "" + children[0];
            }
            {
              checkHtmlStringCoercion(children);
            }
            value = "" + children;
          }
          if (typeof value === "string" && value[0] === "\n") {
            target.push(leadingNewline);
          }
          if (value !== null) {
            {
              checkAttributeStringCoercion(value, "value");
            }
            target.push(stringToChunk(encodeHTMLTextNode("" + value)));
          }
          return null;
        }
        function pushSelfClosing(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw new Error(tag + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTagSelfClosing);
          return null;
        }
        function pushStartMenuItem(target, props, responseState) {
          target.push(startChunkForTag("menuitem"));
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw new Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          return null;
        }
        function pushStartTitle(target, props, responseState) {
          target.push(startChunkForTag("title"));
          var children = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  throw new Error("`dangerouslySetInnerHTML` does not make sense on <title>.");
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          {
            var child = Array.isArray(children) && children.length < 2 ? children[0] || null : children;
            if (Array.isArray(children) && children.length > 1) {
              error("A title element received an array with more than 1 element as children. In browsers title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
            } else if (child != null && child.$$typeof != null) {
              error("A title element received a React element for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
            } else if (child != null && typeof child !== "string" && typeof child !== "number") {
              error("A title element received a value that was not a string or number for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
            }
          }
          return children;
        }
        function pushStartGenericElement(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          if (typeof children === "string") {
            target.push(stringToChunk(encodeHTMLTextNode(children)));
            return null;
          }
          return children;
        }
        function pushStartCustomElement(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "style":
                  pushStyle(target, responseState, propValue);
                  break;
                case "suppressContentEditableWarning":
                case "suppressHydrationWarning":
                  break;
                default:
                  if (isAttributeNameSafe(propKey) && typeof propValue !== "function" && typeof propValue !== "symbol") {
                    target.push(attributeSeparator, stringToChunk(propKey), attributeAssign, stringToChunk(escapeTextForBrowser(propValue)), attributeEnd);
                  }
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          pushInnerHTML(target, innerHTML, children);
          return children;
        }
        var leadingNewline = stringToPrecomputedChunk("\n");
        function pushStartPreformattedElement(target, props, tag, responseState) {
          target.push(startChunkForTag(tag));
          var children = null;
          var innerHTML = null;
          for (var propKey in props) {
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (propValue == null) {
                continue;
              }
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                default:
                  pushAttribute(target, responseState, propKey, propValue);
                  break;
              }
            }
          }
          target.push(endOfStartTag);
          if (innerHTML != null) {
            if (children != null) {
              throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
            }
            if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
              throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
            }
            var html = innerHTML.__html;
            if (html !== null && html !== void 0) {
              if (typeof html === "string" && html.length > 0 && html[0] === "\n") {
                target.push(leadingNewline, stringToChunk(html));
              } else {
                {
                  checkHtmlStringCoercion(html);
                }
                target.push(stringToChunk("" + html));
              }
            }
          }
          if (typeof children === "string" && children[0] === "\n") {
            target.push(leadingNewline);
          }
          return children;
        }
        var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
        var validatedTagCache = /* @__PURE__ */ new Map();
        function startChunkForTag(tag) {
          var tagStartChunk = validatedTagCache.get(tag);
          if (tagStartChunk === void 0) {
            if (!VALID_TAG_REGEX.test(tag)) {
              throw new Error("Invalid tag: " + tag);
            }
            tagStartChunk = stringToPrecomputedChunk("<" + tag);
            validatedTagCache.set(tag, tagStartChunk);
          }
          return tagStartChunk;
        }
        var DOCTYPE = stringToPrecomputedChunk("<!DOCTYPE html>");
        function pushStartInstance(target, type, props, responseState, formatContext) {
          {
            validateProperties(type, props);
            validateProperties$1(type, props);
            validateProperties$2(type, props, null);
            if (!props.suppressContentEditableWarning && props.contentEditable && props.children != null) {
              error("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional.");
            }
            if (formatContext.insertionMode !== SVG_MODE && formatContext.insertionMode !== MATHML_MODE) {
              if (type.indexOf("-") === -1 && typeof props.is !== "string" && type.toLowerCase() !== type) {
                error("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", type);
              }
            }
          }
          switch (type) {
            case "select":
              return pushStartSelect(target, props, responseState);
            case "option":
              return pushStartOption(target, props, responseState, formatContext);
            case "textarea":
              return pushStartTextArea(target, props, responseState);
            case "input":
              return pushInput(target, props, responseState);
            case "menuitem":
              return pushStartMenuItem(target, props, responseState);
            case "title":
              return pushStartTitle(target, props, responseState);
            case "listing":
            case "pre": {
              return pushStartPreformattedElement(target, props, type, responseState);
            }
            case "area":
            case "base":
            case "br":
            case "col":
            case "embed":
            case "hr":
            case "img":
            case "keygen":
            case "link":
            case "meta":
            case "param":
            case "source":
            case "track":
            case "wbr": {
              return pushSelfClosing(target, props, type, responseState);
            }
            case "annotation-xml":
            case "color-profile":
            case "font-face":
            case "font-face-src":
            case "font-face-uri":
            case "font-face-format":
            case "font-face-name":
            case "missing-glyph": {
              return pushStartGenericElement(target, props, type, responseState);
            }
            case "html": {
              if (formatContext.insertionMode === ROOT_HTML_MODE) {
                target.push(DOCTYPE);
              }
              return pushStartGenericElement(target, props, type, responseState);
            }
            default: {
              if (type.indexOf("-") === -1 && typeof props.is !== "string") {
                return pushStartGenericElement(target, props, type, responseState);
              } else {
                return pushStartCustomElement(target, props, type, responseState);
              }
            }
          }
        }
        var endTag1 = stringToPrecomputedChunk("</");
        var endTag2 = stringToPrecomputedChunk(">");
        function pushEndInstance(target, type, props) {
          switch (type) {
            case "area":
            case "base":
            case "br":
            case "col":
            case "embed":
            case "hr":
            case "img":
            case "input":
            case "keygen":
            case "link":
            case "meta":
            case "param":
            case "source":
            case "track":
            case "wbr": {
              break;
            }
            default: {
              target.push(endTag1, stringToChunk(type), endTag2);
            }
          }
        }
        function writeCompletedRoot(destination, responseState) {
          var bootstrapChunks = responseState.bootstrapChunks;
          var i = 0;
          for (; i < bootstrapChunks.length - 1; i++) {
            writeChunk(destination, bootstrapChunks[i]);
          }
          if (i < bootstrapChunks.length) {
            return writeChunkAndReturn(destination, bootstrapChunks[i]);
          }
          return true;
        }
        var placeholder1 = stringToPrecomputedChunk('<template id="');
        var placeholder2 = stringToPrecomputedChunk('"></template>');
        function writePlaceholder(destination, responseState, id) {
          writeChunk(destination, placeholder1);
          writeChunk(destination, responseState.placeholderPrefix);
          var formattedID = stringToChunk(id.toString(16));
          writeChunk(destination, formattedID);
          return writeChunkAndReturn(destination, placeholder2);
        }
        var startCompletedSuspenseBoundary = stringToPrecomputedChunk("<!--$-->");
        var startPendingSuspenseBoundary1 = stringToPrecomputedChunk('<!--$?--><template id="');
        var startPendingSuspenseBoundary2 = stringToPrecomputedChunk('"></template>');
        var startClientRenderedSuspenseBoundary = stringToPrecomputedChunk("<!--$!-->");
        var endSuspenseBoundary = stringToPrecomputedChunk("<!--/$-->");
        var clientRenderedSuspenseBoundaryError1 = stringToPrecomputedChunk("<template");
        var clientRenderedSuspenseBoundaryErrorAttrInterstitial = stringToPrecomputedChunk('"');
        var clientRenderedSuspenseBoundaryError1A = stringToPrecomputedChunk(' data-dgst="');
        var clientRenderedSuspenseBoundaryError1B = stringToPrecomputedChunk(' data-msg="');
        var clientRenderedSuspenseBoundaryError1C = stringToPrecomputedChunk(' data-stck="');
        var clientRenderedSuspenseBoundaryError2 = stringToPrecomputedChunk("></template>");
        function writeStartCompletedSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, startCompletedSuspenseBoundary);
        }
        function writeStartPendingSuspenseBoundary(destination, responseState, id) {
          writeChunk(destination, startPendingSuspenseBoundary1);
          if (id === null) {
            throw new Error("An ID must have been assigned before we can complete the boundary.");
          }
          writeChunk(destination, id);
          return writeChunkAndReturn(destination, startPendingSuspenseBoundary2);
        }
        function writeStartClientRenderedSuspenseBoundary(destination, responseState, errorDigest, errorMesssage, errorComponentStack) {
          var result;
          result = writeChunkAndReturn(destination, startClientRenderedSuspenseBoundary);
          writeChunk(destination, clientRenderedSuspenseBoundaryError1);
          if (errorDigest) {
            writeChunk(destination, clientRenderedSuspenseBoundaryError1A);
            writeChunk(destination, stringToChunk(escapeTextForBrowser(errorDigest)));
            writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
          }
          {
            if (errorMesssage) {
              writeChunk(destination, clientRenderedSuspenseBoundaryError1B);
              writeChunk(destination, stringToChunk(escapeTextForBrowser(errorMesssage)));
              writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
            }
            if (errorComponentStack) {
              writeChunk(destination, clientRenderedSuspenseBoundaryError1C);
              writeChunk(destination, stringToChunk(escapeTextForBrowser(errorComponentStack)));
              writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
            }
          }
          result = writeChunkAndReturn(destination, clientRenderedSuspenseBoundaryError2);
          return result;
        }
        function writeEndCompletedSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, endSuspenseBoundary);
        }
        function writeEndPendingSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, endSuspenseBoundary);
        }
        function writeEndClientRenderedSuspenseBoundary(destination, responseState) {
          return writeChunkAndReturn(destination, endSuspenseBoundary);
        }
        var startSegmentHTML = stringToPrecomputedChunk('<div hidden id="');
        var startSegmentHTML2 = stringToPrecomputedChunk('">');
        var endSegmentHTML = stringToPrecomputedChunk("</div>");
        var startSegmentSVG = stringToPrecomputedChunk('<svg aria-hidden="true" style="display:none" id="');
        var startSegmentSVG2 = stringToPrecomputedChunk('">');
        var endSegmentSVG = stringToPrecomputedChunk("</svg>");
        var startSegmentMathML = stringToPrecomputedChunk('<math aria-hidden="true" style="display:none" id="');
        var startSegmentMathML2 = stringToPrecomputedChunk('">');
        var endSegmentMathML = stringToPrecomputedChunk("</math>");
        var startSegmentTable = stringToPrecomputedChunk('<table hidden id="');
        var startSegmentTable2 = stringToPrecomputedChunk('">');
        var endSegmentTable = stringToPrecomputedChunk("</table>");
        var startSegmentTableBody = stringToPrecomputedChunk('<table hidden><tbody id="');
        var startSegmentTableBody2 = stringToPrecomputedChunk('">');
        var endSegmentTableBody = stringToPrecomputedChunk("</tbody></table>");
        var startSegmentTableRow = stringToPrecomputedChunk('<table hidden><tr id="');
        var startSegmentTableRow2 = stringToPrecomputedChunk('">');
        var endSegmentTableRow = stringToPrecomputedChunk("</tr></table>");
        var startSegmentColGroup = stringToPrecomputedChunk('<table hidden><colgroup id="');
        var startSegmentColGroup2 = stringToPrecomputedChunk('">');
        var endSegmentColGroup = stringToPrecomputedChunk("</colgroup></table>");
        function writeStartSegment(destination, responseState, formatContext, id) {
          switch (formatContext.insertionMode) {
            case ROOT_HTML_MODE:
            case HTML_MODE: {
              writeChunk(destination, startSegmentHTML);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentHTML2);
            }
            case SVG_MODE: {
              writeChunk(destination, startSegmentSVG);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentSVG2);
            }
            case MATHML_MODE: {
              writeChunk(destination, startSegmentMathML);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentMathML2);
            }
            case HTML_TABLE_MODE: {
              writeChunk(destination, startSegmentTable);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentTable2);
            }
            case HTML_TABLE_BODY_MODE: {
              writeChunk(destination, startSegmentTableBody);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentTableBody2);
            }
            case HTML_TABLE_ROW_MODE: {
              writeChunk(destination, startSegmentTableRow);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentTableRow2);
            }
            case HTML_COLGROUP_MODE: {
              writeChunk(destination, startSegmentColGroup);
              writeChunk(destination, responseState.segmentPrefix);
              writeChunk(destination, stringToChunk(id.toString(16)));
              return writeChunkAndReturn(destination, startSegmentColGroup2);
            }
            default: {
              throw new Error("Unknown insertion mode. This is a bug in React.");
            }
          }
        }
        function writeEndSegment(destination, formatContext) {
          switch (formatContext.insertionMode) {
            case ROOT_HTML_MODE:
            case HTML_MODE: {
              return writeChunkAndReturn(destination, endSegmentHTML);
            }
            case SVG_MODE: {
              return writeChunkAndReturn(destination, endSegmentSVG);
            }
            case MATHML_MODE: {
              return writeChunkAndReturn(destination, endSegmentMathML);
            }
            case HTML_TABLE_MODE: {
              return writeChunkAndReturn(destination, endSegmentTable);
            }
            case HTML_TABLE_BODY_MODE: {
              return writeChunkAndReturn(destination, endSegmentTableBody);
            }
            case HTML_TABLE_ROW_MODE: {
              return writeChunkAndReturn(destination, endSegmentTableRow);
            }
            case HTML_COLGROUP_MODE: {
              return writeChunkAndReturn(destination, endSegmentColGroup);
            }
            default: {
              throw new Error("Unknown insertion mode. This is a bug in React.");
            }
          }
        }
        var completeSegmentFunction = "function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)}";
        var completeBoundaryFunction = 'function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}}';
        var clientRenderFunction = 'function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())}';
        var completeSegmentScript1Full = stringToPrecomputedChunk(completeSegmentFunction + ';$RS("');
        var completeSegmentScript1Partial = stringToPrecomputedChunk('$RS("');
        var completeSegmentScript2 = stringToPrecomputedChunk('","');
        var completeSegmentScript3 = stringToPrecomputedChunk('")<\/script>');
        function writeCompletedSegmentInstruction(destination, responseState, contentSegmentID) {
          writeChunk(destination, responseState.startInlineScript);
          if (!responseState.sentCompleteSegmentFunction) {
            responseState.sentCompleteSegmentFunction = true;
            writeChunk(destination, completeSegmentScript1Full);
          } else {
            writeChunk(destination, completeSegmentScript1Partial);
          }
          writeChunk(destination, responseState.segmentPrefix);
          var formattedID = stringToChunk(contentSegmentID.toString(16));
          writeChunk(destination, formattedID);
          writeChunk(destination, completeSegmentScript2);
          writeChunk(destination, responseState.placeholderPrefix);
          writeChunk(destination, formattedID);
          return writeChunkAndReturn(destination, completeSegmentScript3);
        }
        var completeBoundaryScript1Full = stringToPrecomputedChunk(completeBoundaryFunction + ';$RC("');
        var completeBoundaryScript1Partial = stringToPrecomputedChunk('$RC("');
        var completeBoundaryScript2 = stringToPrecomputedChunk('","');
        var completeBoundaryScript3 = stringToPrecomputedChunk('")<\/script>');
        function writeCompletedBoundaryInstruction(destination, responseState, boundaryID, contentSegmentID) {
          writeChunk(destination, responseState.startInlineScript);
          if (!responseState.sentCompleteBoundaryFunction) {
            responseState.sentCompleteBoundaryFunction = true;
            writeChunk(destination, completeBoundaryScript1Full);
          } else {
            writeChunk(destination, completeBoundaryScript1Partial);
          }
          if (boundaryID === null) {
            throw new Error("An ID must have been assigned before we can complete the boundary.");
          }
          var formattedContentID = stringToChunk(contentSegmentID.toString(16));
          writeChunk(destination, boundaryID);
          writeChunk(destination, completeBoundaryScript2);
          writeChunk(destination, responseState.segmentPrefix);
          writeChunk(destination, formattedContentID);
          return writeChunkAndReturn(destination, completeBoundaryScript3);
        }
        var clientRenderScript1Full = stringToPrecomputedChunk(clientRenderFunction + ';$RX("');
        var clientRenderScript1Partial = stringToPrecomputedChunk('$RX("');
        var clientRenderScript1A = stringToPrecomputedChunk('"');
        var clientRenderScript2 = stringToPrecomputedChunk(")<\/script>");
        var clientRenderErrorScriptArgInterstitial = stringToPrecomputedChunk(",");
        function writeClientRenderBoundaryInstruction(destination, responseState, boundaryID, errorDigest, errorMessage, errorComponentStack) {
          writeChunk(destination, responseState.startInlineScript);
          if (!responseState.sentClientRenderFunction) {
            responseState.sentClientRenderFunction = true;
            writeChunk(destination, clientRenderScript1Full);
          } else {
            writeChunk(destination, clientRenderScript1Partial);
          }
          if (boundaryID === null) {
            throw new Error("An ID must have been assigned before we can complete the boundary.");
          }
          writeChunk(destination, boundaryID);
          writeChunk(destination, clientRenderScript1A);
          if (errorDigest || errorMessage || errorComponentStack) {
            writeChunk(destination, clientRenderErrorScriptArgInterstitial);
            writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorDigest || "")));
          }
          if (errorMessage || errorComponentStack) {
            writeChunk(destination, clientRenderErrorScriptArgInterstitial);
            writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorMessage || "")));
          }
          if (errorComponentStack) {
            writeChunk(destination, clientRenderErrorScriptArgInterstitial);
            writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorComponentStack)));
          }
          return writeChunkAndReturn(destination, clientRenderScript2);
        }
        var regexForJSStringsInScripts = /[<\u2028\u2029]/g;
        function escapeJSStringsForInstructionScripts(input) {
          var escaped = JSON.stringify(input);
          return escaped.replace(regexForJSStringsInScripts, function(match) {
            switch (match) {
              case "<":
                return "\\u003c";
              case "\u2028":
                return "\\u2028";
              case "\u2029":
                return "\\u2029";
              default: {
                throw new Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
              }
            }
          });
        }
        var assign = Object.assign;
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PORTAL_TYPE = Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var REACT_SCOPE_TYPE = Symbol.for("react.scope");
        var REACT_DEBUG_TRACING_MODE_TYPE = Symbol.for("react.debug_trace_mode");
        var REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden");
        var REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = Symbol.for("react.default_value");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x) {
                var match = x.stack.trim().match(/\n( *(at )?)/);
                prefix = match && match[1] || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn, construct) {
          if (!fn || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher.current;
            ReactCurrentDispatcher.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x) {
                  control = x;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              }
              fn();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c = controlLines.length - 1;
              while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                c--;
              }
              for (; s >= 1 && c >= 0; s--, c--) {
                if (sampleLines[s] !== controlLines[c]) {
                  if (s !== 1 || c !== 1) {
                    do {
                      s--;
                      c--;
                      if (c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        if (fn.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn.displayName);
                        }
                        {
                          if (typeof fn === "function") {
                            componentFrameCache.set(fn, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn ? fn.displayName || fn.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn === "function") {
              componentFrameCache.set(fn, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeClassComponentFrame(ctor, source, ownerFn) {
          {
            return describeNativeComponentFrame(ctor, true);
          }
        }
        function describeFunctionComponentFrame(fn, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn, false);
          }
        }
        function shouldConstruct(Component) {
          var prototype = Component.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {
                }
              }
            }
          }
          return "";
        }
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        var warnedAboutMissingGetChildContext;
        {
          warnedAboutMissingGetChildContext = {};
        }
        var emptyContextObject = {};
        {
          Object.freeze(emptyContextObject);
        }
        function getMaskedContext(type, unmaskedContext) {
          {
            var contextTypes = type.contextTypes;
            if (!contextTypes) {
              return emptyContextObject;
            }
            var context = {};
            for (var key in contextTypes) {
              context[key] = unmaskedContext[key];
            }
            {
              var name = getComponentNameFromType(type) || "Unknown";
              checkPropTypes(contextTypes, context, "context", name);
            }
            return context;
          }
        }
        function processChildContext(instance, type, parentContext, childContextTypes) {
          {
            if (typeof instance.getChildContext !== "function") {
              {
                var componentName = getComponentNameFromType(type) || "Unknown";
                if (!warnedAboutMissingGetChildContext[componentName]) {
                  warnedAboutMissingGetChildContext[componentName] = true;
                  error("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", componentName, componentName);
                }
              }
              return parentContext;
            }
            var childContext = instance.getChildContext();
            for (var contextKey in childContext) {
              if (!(contextKey in childContextTypes)) {
                throw new Error((getComponentNameFromType(type) || "Unknown") + '.getChildContext(): key "' + contextKey + '" is not defined in childContextTypes.');
              }
            }
            {
              var name = getComponentNameFromType(type) || "Unknown";
              checkPropTypes(childContextTypes, childContext, "child context", name);
            }
            return assign({}, parentContext, childContext);
          }
        }
        var rendererSigil;
        {
          rendererSigil = {};
        }
        var rootContextSnapshot = null;
        var currentActiveSnapshot = null;
        function popNode(prev) {
          {
            prev.context._currentValue = prev.parentValue;
          }
        }
        function pushNode(next) {
          {
            next.context._currentValue = next.value;
          }
        }
        function popToNearestCommonAncestor(prev, next) {
          if (prev === next) ;
          else {
            popNode(prev);
            var parentPrev = prev.parent;
            var parentNext = next.parent;
            if (parentPrev === null) {
              if (parentNext !== null) {
                throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
              }
            } else {
              if (parentNext === null) {
                throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
              }
              popToNearestCommonAncestor(parentPrev, parentNext);
            }
            pushNode(next);
          }
        }
        function popAllPrevious(prev) {
          popNode(prev);
          var parentPrev = prev.parent;
          if (parentPrev !== null) {
            popAllPrevious(parentPrev);
          }
        }
        function pushAllNext(next) {
          var parentNext = next.parent;
          if (parentNext !== null) {
            pushAllNext(parentNext);
          }
          pushNode(next);
        }
        function popPreviousToCommonLevel(prev, next) {
          popNode(prev);
          var parentPrev = prev.parent;
          if (parentPrev === null) {
            throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
          }
          if (parentPrev.depth === next.depth) {
            popToNearestCommonAncestor(parentPrev, next);
          } else {
            popPreviousToCommonLevel(parentPrev, next);
          }
        }
        function popNextToCommonLevel(prev, next) {
          var parentNext = next.parent;
          if (parentNext === null) {
            throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
          }
          if (prev.depth === parentNext.depth) {
            popToNearestCommonAncestor(prev, parentNext);
          } else {
            popNextToCommonLevel(prev, parentNext);
          }
          pushNode(next);
        }
        function switchContext(newSnapshot) {
          var prev = currentActiveSnapshot;
          var next = newSnapshot;
          if (prev !== next) {
            if (prev === null) {
              pushAllNext(next);
            } else if (next === null) {
              popAllPrevious(prev);
            } else if (prev.depth === next.depth) {
              popToNearestCommonAncestor(prev, next);
            } else if (prev.depth > next.depth) {
              popPreviousToCommonLevel(prev, next);
            } else {
              popNextToCommonLevel(prev, next);
            }
            currentActiveSnapshot = next;
          }
        }
        function pushProvider(context, nextValue) {
          var prevValue;
          {
            prevValue = context._currentValue;
            context._currentValue = nextValue;
            {
              if (context._currentRenderer !== void 0 && context._currentRenderer !== null && context._currentRenderer !== rendererSigil) {
                error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
              }
              context._currentRenderer = rendererSigil;
            }
          }
          var prevNode = currentActiveSnapshot;
          var newNode = {
            parent: prevNode,
            depth: prevNode === null ? 0 : prevNode.depth + 1,
            context,
            parentValue: prevValue,
            value: nextValue
          };
          currentActiveSnapshot = newNode;
          return newNode;
        }
        function popProvider(context) {
          var prevSnapshot = currentActiveSnapshot;
          if (prevSnapshot === null) {
            throw new Error("Tried to pop a Context at the root of the app. This is a bug in React.");
          }
          {
            if (prevSnapshot.context !== context) {
              error("The parent context is not the expected context. This is probably a bug in React.");
            }
          }
          {
            var value = prevSnapshot.parentValue;
            if (value === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
              prevSnapshot.context._currentValue = prevSnapshot.context._defaultValue;
            } else {
              prevSnapshot.context._currentValue = value;
            }
            {
              if (context._currentRenderer !== void 0 && context._currentRenderer !== null && context._currentRenderer !== rendererSigil) {
                error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
              }
              context._currentRenderer = rendererSigil;
            }
          }
          return currentActiveSnapshot = prevSnapshot.parent;
        }
        function getActiveContext() {
          return currentActiveSnapshot;
        }
        function readContext(context) {
          var value = context._currentValue;
          return value;
        }
        function get(key) {
          return key._reactInternals;
        }
        function set(key, value) {
          key._reactInternals = value;
        }
        var didWarnAboutNoopUpdateForComponent = {};
        var didWarnAboutDeprecatedWillMount = {};
        var didWarnAboutUninitializedState;
        var didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate;
        var didWarnAboutLegacyLifecyclesAndDerivedState;
        var didWarnAboutUndefinedDerivedState;
        var warnOnUndefinedDerivedState;
        var warnOnInvalidCallback;
        var didWarnAboutDirectlyAssigningPropsToState;
        var didWarnAboutContextTypeAndContextTypes;
        var didWarnAboutInvalidateContextType;
        {
          didWarnAboutUninitializedState = /* @__PURE__ */ new Set();
          didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = /* @__PURE__ */ new Set();
          didWarnAboutLegacyLifecyclesAndDerivedState = /* @__PURE__ */ new Set();
          didWarnAboutDirectlyAssigningPropsToState = /* @__PURE__ */ new Set();
          didWarnAboutUndefinedDerivedState = /* @__PURE__ */ new Set();
          didWarnAboutContextTypeAndContextTypes = /* @__PURE__ */ new Set();
          didWarnAboutInvalidateContextType = /* @__PURE__ */ new Set();
          var didWarnOnInvalidCallback = /* @__PURE__ */ new Set();
          warnOnInvalidCallback = function(callback, callerName) {
            if (callback === null || typeof callback === "function") {
              return;
            }
            var key = callerName + "_" + callback;
            if (!didWarnOnInvalidCallback.has(key)) {
              didWarnOnInvalidCallback.add(key);
              error("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", callerName, callback);
            }
          };
          warnOnUndefinedDerivedState = function(type, partialState) {
            if (partialState === void 0) {
              var componentName = getComponentNameFromType(type) || "Component";
              if (!didWarnAboutUndefinedDerivedState.has(componentName)) {
                didWarnAboutUndefinedDerivedState.add(componentName);
                error("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", componentName);
              }
            }
          };
        }
        function warnNoop(publicInstance, callerName) {
          {
            var _constructor = publicInstance.constructor;
            var componentName = _constructor && getComponentNameFromType(_constructor) || "ReactClass";
            var warningKey = componentName + "." + callerName;
            if (didWarnAboutNoopUpdateForComponent[warningKey]) {
              return;
            }
            error("%s(...): Can only update a mounting component. This usually means you called %s() outside componentWillMount() on the server. This is a no-op.\n\nPlease check the code for the %s component.", callerName, callerName, componentName);
            didWarnAboutNoopUpdateForComponent[warningKey] = true;
          }
        }
        var classComponentUpdater = {
          isMounted: function(inst) {
            return false;
          },
          enqueueSetState: function(inst, payload, callback) {
            var internals = get(inst);
            if (internals.queue === null) {
              warnNoop(inst, "setState");
            } else {
              internals.queue.push(payload);
              {
                if (callback !== void 0 && callback !== null) {
                  warnOnInvalidCallback(callback, "setState");
                }
              }
            }
          },
          enqueueReplaceState: function(inst, payload, callback) {
            var internals = get(inst);
            internals.replace = true;
            internals.queue = [payload];
            {
              if (callback !== void 0 && callback !== null) {
                warnOnInvalidCallback(callback, "setState");
              }
            }
          },
          enqueueForceUpdate: function(inst, callback) {
            var internals = get(inst);
            if (internals.queue === null) {
              warnNoop(inst, "forceUpdate");
            } else {
              {
                if (callback !== void 0 && callback !== null) {
                  warnOnInvalidCallback(callback, "setState");
                }
              }
            }
          }
        };
        function applyDerivedStateFromProps(instance, ctor, getDerivedStateFromProps, prevState, nextProps) {
          var partialState = getDerivedStateFromProps(nextProps, prevState);
          {
            warnOnUndefinedDerivedState(ctor, partialState);
          }
          var newState = partialState === null || partialState === void 0 ? prevState : assign({}, prevState, partialState);
          return newState;
        }
        function constructClassInstance(ctor, props, maskedLegacyContext) {
          var context = emptyContextObject;
          var contextType = ctor.contextType;
          {
            if ("contextType" in ctor) {
              var isValid = (
                // Allow null for conditional declaration
                contextType === null || contextType !== void 0 && contextType.$$typeof === REACT_CONTEXT_TYPE && contextType._context === void 0
              );
              if (!isValid && !didWarnAboutInvalidateContextType.has(ctor)) {
                didWarnAboutInvalidateContextType.add(ctor);
                var addendum = "";
                if (contextType === void 0) {
                  addendum = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file.";
                } else if (typeof contextType !== "object") {
                  addendum = " However, it is set to a " + typeof contextType + ".";
                } else if (contextType.$$typeof === REACT_PROVIDER_TYPE) {
                  addendum = " Did you accidentally pass the Context.Provider instead?";
                } else if (contextType._context !== void 0) {
                  addendum = " Did you accidentally pass the Context.Consumer instead?";
                } else {
                  addendum = " However, it is set to an object with keys {" + Object.keys(contextType).join(", ") + "}.";
                }
                error("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", getComponentNameFromType(ctor) || "Component", addendum);
              }
            }
          }
          if (typeof contextType === "object" && contextType !== null) {
            context = readContext(contextType);
          } else {
            context = maskedLegacyContext;
          }
          var instance = new ctor(props, context);
          {
            if (typeof ctor.getDerivedStateFromProps === "function" && (instance.state === null || instance.state === void 0)) {
              var componentName = getComponentNameFromType(ctor) || "Component";
              if (!didWarnAboutUninitializedState.has(componentName)) {
                didWarnAboutUninitializedState.add(componentName);
                error("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", componentName, instance.state === null ? "null" : "undefined", componentName);
              }
            }
            if (typeof ctor.getDerivedStateFromProps === "function" || typeof instance.getSnapshotBeforeUpdate === "function") {
              var foundWillMountName = null;
              var foundWillReceivePropsName = null;
              var foundWillUpdateName = null;
              if (typeof instance.componentWillMount === "function" && instance.componentWillMount.__suppressDeprecationWarning !== true) {
                foundWillMountName = "componentWillMount";
              } else if (typeof instance.UNSAFE_componentWillMount === "function") {
                foundWillMountName = "UNSAFE_componentWillMount";
              }
              if (typeof instance.componentWillReceiveProps === "function" && instance.componentWillReceiveProps.__suppressDeprecationWarning !== true) {
                foundWillReceivePropsName = "componentWillReceiveProps";
              } else if (typeof instance.UNSAFE_componentWillReceiveProps === "function") {
                foundWillReceivePropsName = "UNSAFE_componentWillReceiveProps";
              }
              if (typeof instance.componentWillUpdate === "function" && instance.componentWillUpdate.__suppressDeprecationWarning !== true) {
                foundWillUpdateName = "componentWillUpdate";
              } else if (typeof instance.UNSAFE_componentWillUpdate === "function") {
                foundWillUpdateName = "UNSAFE_componentWillUpdate";
              }
              if (foundWillMountName !== null || foundWillReceivePropsName !== null || foundWillUpdateName !== null) {
                var _componentName = getComponentNameFromType(ctor) || "Component";
                var newApiName = typeof ctor.getDerivedStateFromProps === "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
                if (!didWarnAboutLegacyLifecyclesAndDerivedState.has(_componentName)) {
                  didWarnAboutLegacyLifecyclesAndDerivedState.add(_componentName);
                  error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://reactjs.org/link/unsafe-component-lifecycles", _componentName, newApiName, foundWillMountName !== null ? "\n  " + foundWillMountName : "", foundWillReceivePropsName !== null ? "\n  " + foundWillReceivePropsName : "", foundWillUpdateName !== null ? "\n  " + foundWillUpdateName : "");
                }
              }
            }
          }
          return instance;
        }
        function checkClassInstance(instance, ctor, newProps) {
          {
            var name = getComponentNameFromType(ctor) || "Component";
            var renderPresent = instance.render;
            if (!renderPresent) {
              if (ctor.prototype && typeof ctor.prototype.render === "function") {
                error("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", name);
              } else {
                error("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", name);
              }
            }
            if (instance.getInitialState && !instance.getInitialState.isReactClassApproved && !instance.state) {
              error("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", name);
            }
            if (instance.getDefaultProps && !instance.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", name);
            }
            if (instance.propTypes) {
              error("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", name);
            }
            if (instance.contextType) {
              error("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", name);
            }
            {
              if (instance.contextTypes) {
                error("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", name);
              }
              if (ctor.contextType && ctor.contextTypes && !didWarnAboutContextTypeAndContextTypes.has(ctor)) {
                didWarnAboutContextTypeAndContextTypes.add(ctor);
                error("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", name);
              }
            }
            if (typeof instance.componentShouldUpdate === "function") {
              error("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", name);
            }
            if (ctor.prototype && ctor.prototype.isPureReactComponent && typeof instance.shouldComponentUpdate !== "undefined") {
              error("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", getComponentNameFromType(ctor) || "A pure component");
            }
            if (typeof instance.componentDidUnmount === "function") {
              error("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", name);
            }
            if (typeof instance.componentDidReceiveProps === "function") {
              error("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", name);
            }
            if (typeof instance.componentWillRecieveProps === "function") {
              error("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", name);
            }
            if (typeof instance.UNSAFE_componentWillRecieveProps === "function") {
              error("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", name);
            }
            var hasMutatedProps = instance.props !== newProps;
            if (instance.props !== void 0 && hasMutatedProps) {
              error("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", name, name);
            }
            if (instance.defaultProps) {
              error("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", name, name);
            }
            if (typeof instance.getSnapshotBeforeUpdate === "function" && typeof instance.componentDidUpdate !== "function" && !didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.has(ctor)) {
              didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.add(ctor);
              error("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", getComponentNameFromType(ctor));
            }
            if (typeof instance.getDerivedStateFromProps === "function") {
              error("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
            }
            if (typeof instance.getDerivedStateFromError === "function") {
              error("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
            }
            if (typeof ctor.getSnapshotBeforeUpdate === "function") {
              error("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", name);
            }
            var _state = instance.state;
            if (_state && (typeof _state !== "object" || isArray(_state))) {
              error("%s.state: must be set to an object or null", name);
            }
            if (typeof instance.getChildContext === "function" && typeof ctor.childContextTypes !== "object") {
              error("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", name);
            }
          }
        }
        function callComponentWillMount(type, instance) {
          var oldState = instance.state;
          if (typeof instance.componentWillMount === "function") {
            {
              if (instance.componentWillMount.__suppressDeprecationWarning !== true) {
                var componentName = getComponentNameFromType(type) || "Unknown";
                if (!didWarnAboutDeprecatedWillMount[componentName]) {
                  warn(
                    // keep this warning in sync with ReactStrictModeWarning.js
                    "componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n* Move code from componentWillMount to componentDidMount (preferred in most cases) or the constructor.\n\nPlease update the following components: %s",
                    componentName
                  );
                  didWarnAboutDeprecatedWillMount[componentName] = true;
                }
              }
            }
            instance.componentWillMount();
          }
          if (typeof instance.UNSAFE_componentWillMount === "function") {
            instance.UNSAFE_componentWillMount();
          }
          if (oldState !== instance.state) {
            {
              error("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", getComponentNameFromType(type) || "Component");
            }
            classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
          }
        }
        function processUpdateQueue(internalInstance, inst, props, maskedLegacyContext) {
          if (internalInstance.queue !== null && internalInstance.queue.length > 0) {
            var oldQueue = internalInstance.queue;
            var oldReplace = internalInstance.replace;
            internalInstance.queue = null;
            internalInstance.replace = false;
            if (oldReplace && oldQueue.length === 1) {
              inst.state = oldQueue[0];
            } else {
              var nextState = oldReplace ? oldQueue[0] : inst.state;
              var dontMutate = true;
              for (var i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
                var partial = oldQueue[i];
                var partialState = typeof partial === "function" ? partial.call(inst, nextState, props, maskedLegacyContext) : partial;
                if (partialState != null) {
                  if (dontMutate) {
                    dontMutate = false;
                    nextState = assign({}, nextState, partialState);
                  } else {
                    assign(nextState, partialState);
                  }
                }
              }
              inst.state = nextState;
            }
          } else {
            internalInstance.queue = null;
          }
        }
        function mountClassInstance(instance, ctor, newProps, maskedLegacyContext) {
          {
            checkClassInstance(instance, ctor, newProps);
          }
          var initialState = instance.state !== void 0 ? instance.state : null;
          instance.updater = classComponentUpdater;
          instance.props = newProps;
          instance.state = initialState;
          var internalInstance = {
            queue: [],
            replace: false
          };
          set(instance, internalInstance);
          var contextType = ctor.contextType;
          if (typeof contextType === "object" && contextType !== null) {
            instance.context = readContext(contextType);
          } else {
            instance.context = maskedLegacyContext;
          }
          {
            if (instance.state === newProps) {
              var componentName = getComponentNameFromType(ctor) || "Component";
              if (!didWarnAboutDirectlyAssigningPropsToState.has(componentName)) {
                didWarnAboutDirectlyAssigningPropsToState.add(componentName);
                error("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", componentName);
              }
            }
          }
          var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
          if (typeof getDerivedStateFromProps === "function") {
            instance.state = applyDerivedStateFromProps(instance, ctor, getDerivedStateFromProps, initialState, newProps);
          }
          if (typeof ctor.getDerivedStateFromProps !== "function" && typeof instance.getSnapshotBeforeUpdate !== "function" && (typeof instance.UNSAFE_componentWillMount === "function" || typeof instance.componentWillMount === "function")) {
            callComponentWillMount(ctor, instance);
            processUpdateQueue(internalInstance, instance, newProps, maskedLegacyContext);
          }
        }
        var emptyTreeContext = {
          id: 1,
          overflow: ""
        };
        function getTreeId(context) {
          var overflow = context.overflow;
          var idWithLeadingBit = context.id;
          var id = idWithLeadingBit & ~getLeadingBit(idWithLeadingBit);
          return id.toString(32) + overflow;
        }
        function pushTreeContext(baseContext, totalChildren, index) {
          var baseIdWithLeadingBit = baseContext.id;
          var baseOverflow = baseContext.overflow;
          var baseLength = getBitLength(baseIdWithLeadingBit) - 1;
          var baseId = baseIdWithLeadingBit & ~(1 << baseLength);
          var slot = index + 1;
          var length = getBitLength(totalChildren) + baseLength;
          if (length > 30) {
            var numberOfOverflowBits = baseLength - baseLength % 5;
            var newOverflowBits = (1 << numberOfOverflowBits) - 1;
            var newOverflow = (baseId & newOverflowBits).toString(32);
            var restOfBaseId = baseId >> numberOfOverflowBits;
            var restOfBaseLength = baseLength - numberOfOverflowBits;
            var restOfLength = getBitLength(totalChildren) + restOfBaseLength;
            var restOfNewBits = slot << restOfBaseLength;
            var id = restOfNewBits | restOfBaseId;
            var overflow = newOverflow + baseOverflow;
            return {
              id: 1 << restOfLength | id,
              overflow
            };
          } else {
            var newBits = slot << baseLength;
            var _id = newBits | baseId;
            var _overflow = baseOverflow;
            return {
              id: 1 << length | _id,
              overflow: _overflow
            };
          }
        }
        function getBitLength(number) {
          return 32 - clz32(number);
        }
        function getLeadingBit(id) {
          return 1 << getBitLength(id) - 1;
        }
        var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
        var log = Math.log;
        var LN2 = Math.LN2;
        function clz32Fallback(x) {
          var asUint = x >>> 0;
          if (asUint === 0) {
            return 32;
          }
          return 31 - (log(asUint) / LN2 | 0) | 0;
        }
        function is(x, y) {
          return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
        }
        var objectIs = typeof Object.is === "function" ? Object.is : is;
        var currentlyRenderingComponent = null;
        var currentlyRenderingTask = null;
        var firstWorkInProgressHook = null;
        var workInProgressHook = null;
        var isReRender = false;
        var didScheduleRenderPhaseUpdate = false;
        var localIdCounter = 0;
        var renderPhaseUpdates = null;
        var numberOfReRenders = 0;
        var RE_RENDER_LIMIT = 25;
        var isInHookUserCodeInDev = false;
        var currentHookNameInDev;
        function resolveCurrentlyRenderingComponent() {
          if (currentlyRenderingComponent === null) {
            throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
          }
          {
            if (isInHookUserCodeInDev) {
              error("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
            }
          }
          return currentlyRenderingComponent;
        }
        function areHookInputsEqual(nextDeps, prevDeps) {
          if (prevDeps === null) {
            {
              error("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", currentHookNameInDev);
            }
            return false;
          }
          {
            if (nextDeps.length !== prevDeps.length) {
              error("The final argument passed to %s changed size between renders. The order and size of this array must remain constant.\n\nPrevious: %s\nIncoming: %s", currentHookNameInDev, "[" + nextDeps.join(", ") + "]", "[" + prevDeps.join(", ") + "]");
            }
          }
          for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
            if (objectIs(nextDeps[i], prevDeps[i])) {
              continue;
            }
            return false;
          }
          return true;
        }
        function createHook() {
          if (numberOfReRenders > 0) {
            throw new Error("Rendered more hooks than during the previous render");
          }
          return {
            memoizedState: null,
            queue: null,
            next: null
          };
        }
        function createWorkInProgressHook() {
          if (workInProgressHook === null) {
            if (firstWorkInProgressHook === null) {
              isReRender = false;
              firstWorkInProgressHook = workInProgressHook = createHook();
            } else {
              isReRender = true;
              workInProgressHook = firstWorkInProgressHook;
            }
          } else {
            if (workInProgressHook.next === null) {
              isReRender = false;
              workInProgressHook = workInProgressHook.next = createHook();
            } else {
              isReRender = true;
              workInProgressHook = workInProgressHook.next;
            }
          }
          return workInProgressHook;
        }
        function prepareToUseHooks(task, componentIdentity) {
          currentlyRenderingComponent = componentIdentity;
          currentlyRenderingTask = task;
          {
            isInHookUserCodeInDev = false;
          }
          localIdCounter = 0;
        }
        function finishHooks(Component, props, children, refOrContext) {
          while (didScheduleRenderPhaseUpdate) {
            didScheduleRenderPhaseUpdate = false;
            localIdCounter = 0;
            numberOfReRenders += 1;
            workInProgressHook = null;
            children = Component(props, refOrContext);
          }
          resetHooksState();
          return children;
        }
        function checkDidRenderIdHook() {
          var didRenderIdHook = localIdCounter !== 0;
          return didRenderIdHook;
        }
        function resetHooksState() {
          {
            isInHookUserCodeInDev = false;
          }
          currentlyRenderingComponent = null;
          currentlyRenderingTask = null;
          didScheduleRenderPhaseUpdate = false;
          firstWorkInProgressHook = null;
          numberOfReRenders = 0;
          renderPhaseUpdates = null;
          workInProgressHook = null;
        }
        function readContext$1(context) {
          {
            if (isInHookUserCodeInDev) {
              error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
            }
          }
          return readContext(context);
        }
        function useContext(context) {
          {
            currentHookNameInDev = "useContext";
          }
          resolveCurrentlyRenderingComponent();
          return readContext(context);
        }
        function basicStateReducer(state, action) {
          return typeof action === "function" ? action(state) : action;
        }
        function useState(initialState) {
          {
            currentHookNameInDev = "useState";
          }
          return useReducer(
            basicStateReducer,
            // useReducer has a special case to support lazy useState initializers
            initialState
          );
        }
        function useReducer(reducer, initialArg, init) {
          {
            if (reducer !== basicStateReducer) {
              currentHookNameInDev = "useReducer";
            }
          }
          currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
          workInProgressHook = createWorkInProgressHook();
          if (isReRender) {
            var queue = workInProgressHook.queue;
            var dispatch = queue.dispatch;
            if (renderPhaseUpdates !== null) {
              var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
              if (firstRenderPhaseUpdate !== void 0) {
                renderPhaseUpdates.delete(queue);
                var newState = workInProgressHook.memoizedState;
                var update = firstRenderPhaseUpdate;
                do {
                  var action = update.action;
                  {
                    isInHookUserCodeInDev = true;
                  }
                  newState = reducer(newState, action);
                  {
                    isInHookUserCodeInDev = false;
                  }
                  update = update.next;
                } while (update !== null);
                workInProgressHook.memoizedState = newState;
                return [newState, dispatch];
              }
            }
            return [workInProgressHook.memoizedState, dispatch];
          } else {
            {
              isInHookUserCodeInDev = true;
            }
            var initialState;
            if (reducer === basicStateReducer) {
              initialState = typeof initialArg === "function" ? initialArg() : initialArg;
            } else {
              initialState = init !== void 0 ? init(initialArg) : initialArg;
            }
            {
              isInHookUserCodeInDev = false;
            }
            workInProgressHook.memoizedState = initialState;
            var _queue = workInProgressHook.queue = {
              last: null,
              dispatch: null
            };
            var _dispatch = _queue.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, _queue);
            return [workInProgressHook.memoizedState, _dispatch];
          }
        }
        function useMemo(nextCreate, deps) {
          currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
          workInProgressHook = createWorkInProgressHook();
          var nextDeps = deps === void 0 ? null : deps;
          if (workInProgressHook !== null) {
            var prevState = workInProgressHook.memoizedState;
            if (prevState !== null) {
              if (nextDeps !== null) {
                var prevDeps = prevState[1];
                if (areHookInputsEqual(nextDeps, prevDeps)) {
                  return prevState[0];
                }
              }
            }
          }
          {
            isInHookUserCodeInDev = true;
          }
          var nextValue = nextCreate();
          {
            isInHookUserCodeInDev = false;
          }
          workInProgressHook.memoizedState = [nextValue, nextDeps];
          return nextValue;
        }
        function useRef(initialValue) {
          currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
          workInProgressHook = createWorkInProgressHook();
          var previousRef = workInProgressHook.memoizedState;
          if (previousRef === null) {
            var ref = {
              current: initialValue
            };
            {
              Object.seal(ref);
            }
            workInProgressHook.memoizedState = ref;
            return ref;
          } else {
            return previousRef;
          }
        }
        function useLayoutEffect(create, inputs) {
          {
            currentHookNameInDev = "useLayoutEffect";
            error("useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format. This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this, useLayoutEffect should only be used in components that render exclusively on the client. See https://reactjs.org/link/uselayouteffect-ssr for common fixes.");
          }
        }
        function dispatchAction(componentIdentity, queue, action) {
          if (numberOfReRenders >= RE_RENDER_LIMIT) {
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          }
          if (componentIdentity === currentlyRenderingComponent) {
            didScheduleRenderPhaseUpdate = true;
            var update = {
              action,
              next: null
            };
            if (renderPhaseUpdates === null) {
              renderPhaseUpdates = /* @__PURE__ */ new Map();
            }
            var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
            if (firstRenderPhaseUpdate === void 0) {
              renderPhaseUpdates.set(queue, update);
            } else {
              var lastRenderPhaseUpdate = firstRenderPhaseUpdate;
              while (lastRenderPhaseUpdate.next !== null) {
                lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
              }
              lastRenderPhaseUpdate.next = update;
            }
          }
        }
        function useCallback(callback, deps) {
          return useMemo(function() {
            return callback;
          }, deps);
        }
        function useMutableSource(source, getSnapshot, subscribe) {
          resolveCurrentlyRenderingComponent();
          return getSnapshot(source._source);
        }
        function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
          if (getServerSnapshot === void 0) {
            throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
          }
          return getServerSnapshot();
        }
        function useDeferredValue(value) {
          resolveCurrentlyRenderingComponent();
          return value;
        }
        function unsupportedStartTransition() {
          throw new Error("startTransition cannot be called during server rendering.");
        }
        function useTransition() {
          resolveCurrentlyRenderingComponent();
          return [false, unsupportedStartTransition];
        }
        function useId() {
          var task = currentlyRenderingTask;
          var treeId = getTreeId(task.treeContext);
          var responseState = currentResponseState;
          if (responseState === null) {
            throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component.");
          }
          var localId = localIdCounter++;
          return makeId(responseState, treeId, localId);
        }
        function noop() {
        }
        var Dispatcher = {
          readContext: readContext$1,
          useContext,
          useMemo,
          useReducer,
          useRef,
          useState,
          useInsertionEffect: noop,
          useLayoutEffect,
          useCallback,
          // useImperativeHandle is not run in the server environment
          useImperativeHandle: noop,
          // Effects are not run in the server environment.
          useEffect: noop,
          // Debugging effect
          useDebugValue: noop,
          useDeferredValue,
          useTransition,
          useId,
          // Subscriptions are not setup in a server environment.
          useMutableSource,
          useSyncExternalStore
        };
        var currentResponseState = null;
        function setCurrentResponseState(responseState) {
          currentResponseState = responseState;
        }
        function getStackByComponentStackNode(componentStack) {
          try {
            var info = "";
            var node = componentStack;
            do {
              switch (node.tag) {
                case 0:
                  info += describeBuiltInComponentFrame(node.type, null, null);
                  break;
                case 1:
                  info += describeFunctionComponentFrame(node.type, null, null);
                  break;
                case 2:
                  info += describeClassComponentFrame(node.type, null, null);
                  break;
              }
              node = node.parent;
            } while (node);
            return info;
          } catch (x) {
            return "\nError generating stack: " + x.message + "\n" + x.stack;
          }
        }
        var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        var PENDING = 0;
        var COMPLETED = 1;
        var FLUSHED = 2;
        var ABORTED = 3;
        var ERRORED = 4;
        var OPEN = 0;
        var CLOSING = 1;
        var CLOSED = 2;
        var DEFAULT_PROGRESSIVE_CHUNK_SIZE = 12800;
        function defaultErrorHandler(error2) {
          console["error"](error2);
          return null;
        }
        function noop$1() {
        }
        function createRequest(children, responseState, rootFormatContext, progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError) {
          var pingedTasks = [];
          var abortSet = /* @__PURE__ */ new Set();
          var request = {
            destination: null,
            responseState,
            progressiveChunkSize: progressiveChunkSize === void 0 ? DEFAULT_PROGRESSIVE_CHUNK_SIZE : progressiveChunkSize,
            status: OPEN,
            fatalError: null,
            nextSegmentId: 0,
            allPendingTasks: 0,
            pendingRootTasks: 0,
            completedRootSegment: null,
            abortableTasks: abortSet,
            pingedTasks,
            clientRenderedBoundaries: [],
            completedBoundaries: [],
            partialBoundaries: [],
            onError: onError === void 0 ? defaultErrorHandler : onError,
            onAllReady: onAllReady === void 0 ? noop$1 : onAllReady,
            onShellReady: onShellReady === void 0 ? noop$1 : onShellReady,
            onShellError: onShellError === void 0 ? noop$1 : onShellError,
            onFatalError: onFatalError === void 0 ? noop$1 : onFatalError
          };
          var rootSegment = createPendingSegment(
            request,
            0,
            null,
            rootFormatContext,
            // Root segments are never embedded in Text on either edge
            false,
            false
          );
          rootSegment.parentFlushed = true;
          var rootTask = createTask(request, children, null, rootSegment, abortSet, emptyContextObject, rootContextSnapshot, emptyTreeContext);
          pingedTasks.push(rootTask);
          return request;
        }
        function pingTask(request, task) {
          var pingedTasks = request.pingedTasks;
          pingedTasks.push(task);
          if (pingedTasks.length === 1) {
            scheduleWork(function() {
              return performWork(request);
            });
          }
        }
        function createSuspenseBoundary(request, fallbackAbortableTasks) {
          return {
            id: UNINITIALIZED_SUSPENSE_BOUNDARY_ID,
            rootSegmentID: -1,
            parentFlushed: false,
            pendingTasks: 0,
            forceClientRender: false,
            completedSegments: [],
            byteSize: 0,
            fallbackAbortableTasks,
            errorDigest: null
          };
        }
        function createTask(request, node, blockedBoundary, blockedSegment, abortSet, legacyContext, context, treeContext) {
          request.allPendingTasks++;
          if (blockedBoundary === null) {
            request.pendingRootTasks++;
          } else {
            blockedBoundary.pendingTasks++;
          }
          var task = {
            node,
            ping: function() {
              return pingTask(request, task);
            },
            blockedBoundary,
            blockedSegment,
            abortSet,
            legacyContext,
            context,
            treeContext
          };
          {
            task.componentStack = null;
          }
          abortSet.add(task);
          return task;
        }
        function createPendingSegment(request, index, boundary, formatContext, lastPushedText, textEmbedded) {
          return {
            status: PENDING,
            id: -1,
            // lazily assigned later
            index,
            parentFlushed: false,
            chunks: [],
            children: [],
            formatContext,
            boundary,
            lastPushedText,
            textEmbedded
          };
        }
        var currentTaskInDEV = null;
        function getCurrentStackInDEV() {
          {
            if (currentTaskInDEV === null || currentTaskInDEV.componentStack === null) {
              return "";
            }
            return getStackByComponentStackNode(currentTaskInDEV.componentStack);
          }
        }
        function pushBuiltInComponentStackInDEV(task, type) {
          {
            task.componentStack = {
              tag: 0,
              parent: task.componentStack,
              type
            };
          }
        }
        function pushFunctionComponentStackInDEV(task, type) {
          {
            task.componentStack = {
              tag: 1,
              parent: task.componentStack,
              type
            };
          }
        }
        function pushClassComponentStackInDEV(task, type) {
          {
            task.componentStack = {
              tag: 2,
              parent: task.componentStack,
              type
            };
          }
        }
        function popComponentStackInDEV(task) {
          {
            if (task.componentStack === null) {
              error("Unexpectedly popped too many stack frames. This is a bug in React.");
            } else {
              task.componentStack = task.componentStack.parent;
            }
          }
        }
        var lastBoundaryErrorComponentStackDev = null;
        function captureBoundaryErrorDetailsDev(boundary, error2) {
          {
            var errorMessage;
            if (typeof error2 === "string") {
              errorMessage = error2;
            } else if (error2 && typeof error2.message === "string") {
              errorMessage = error2.message;
            } else {
              errorMessage = String(error2);
            }
            var errorComponentStack = lastBoundaryErrorComponentStackDev || getCurrentStackInDEV();
            lastBoundaryErrorComponentStackDev = null;
            boundary.errorMessage = errorMessage;
            boundary.errorComponentStack = errorComponentStack;
          }
        }
        function logRecoverableError(request, error2) {
          var errorDigest = request.onError(error2);
          if (errorDigest != null && typeof errorDigest !== "string") {
            throw new Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof errorDigest + '" instead');
          }
          return errorDigest;
        }
        function fatalError(request, error2) {
          var onShellError = request.onShellError;
          onShellError(error2);
          var onFatalError = request.onFatalError;
          onFatalError(error2);
          if (request.destination !== null) {
            request.status = CLOSED;
            closeWithError(request.destination, error2);
          } else {
            request.status = CLOSING;
            request.fatalError = error2;
          }
        }
        function renderSuspenseBoundary(request, task, props) {
          pushBuiltInComponentStackInDEV(task, "Suspense");
          var parentBoundary = task.blockedBoundary;
          var parentSegment = task.blockedSegment;
          var fallback = props.fallback;
          var content = props.children;
          var fallbackAbortSet = /* @__PURE__ */ new Set();
          var newBoundary = createSuspenseBoundary(request, fallbackAbortSet);
          var insertionIndex = parentSegment.chunks.length;
          var boundarySegment = createPendingSegment(
            request,
            insertionIndex,
            newBoundary,
            parentSegment.formatContext,
            // boundaries never require text embedding at their edges because comment nodes bound them
            false,
            false
          );
          parentSegment.children.push(boundarySegment);
          parentSegment.lastPushedText = false;
          var contentRootSegment = createPendingSegment(
            request,
            0,
            null,
            parentSegment.formatContext,
            // boundaries never require text embedding at their edges because comment nodes bound them
            false,
            false
          );
          contentRootSegment.parentFlushed = true;
          task.blockedBoundary = newBoundary;
          task.blockedSegment = contentRootSegment;
          try {
            renderNode(request, task, content);
            pushSegmentFinale(contentRootSegment.chunks, request.responseState, contentRootSegment.lastPushedText, contentRootSegment.textEmbedded);
            contentRootSegment.status = COMPLETED;
            queueCompletedSegment(newBoundary, contentRootSegment);
            if (newBoundary.pendingTasks === 0) {
              popComponentStackInDEV(task);
              return;
            }
          } catch (error2) {
            contentRootSegment.status = ERRORED;
            newBoundary.forceClientRender = true;
            newBoundary.errorDigest = logRecoverableError(request, error2);
            {
              captureBoundaryErrorDetailsDev(newBoundary, error2);
            }
          } finally {
            task.blockedBoundary = parentBoundary;
            task.blockedSegment = parentSegment;
          }
          var suspendedFallbackTask = createTask(request, fallback, parentBoundary, boundarySegment, fallbackAbortSet, task.legacyContext, task.context, task.treeContext);
          {
            suspendedFallbackTask.componentStack = task.componentStack;
          }
          request.pingedTasks.push(suspendedFallbackTask);
          popComponentStackInDEV(task);
        }
        function renderHostElement(request, task, type, props) {
          pushBuiltInComponentStackInDEV(task, type);
          var segment = task.blockedSegment;
          var children = pushStartInstance(segment.chunks, type, props, request.responseState, segment.formatContext);
          segment.lastPushedText = false;
          var prevContext = segment.formatContext;
          segment.formatContext = getChildFormatContext(prevContext, type, props);
          renderNode(request, task, children);
          segment.formatContext = prevContext;
          pushEndInstance(segment.chunks, type);
          segment.lastPushedText = false;
          popComponentStackInDEV(task);
        }
        function shouldConstruct$1(Component) {
          return Component.prototype && Component.prototype.isReactComponent;
        }
        function renderWithHooks(request, task, Component, props, secondArg) {
          var componentIdentity = {};
          prepareToUseHooks(task, componentIdentity);
          var result = Component(props, secondArg);
          return finishHooks(Component, props, result, secondArg);
        }
        function finishClassComponent(request, task, instance, Component, props) {
          var nextChildren = instance.render();
          {
            if (instance.props !== props) {
              if (!didWarnAboutReassigningProps) {
                error("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", getComponentNameFromType(Component) || "a component");
              }
              didWarnAboutReassigningProps = true;
            }
          }
          {
            var childContextTypes = Component.childContextTypes;
            if (childContextTypes !== null && childContextTypes !== void 0) {
              var previousContext = task.legacyContext;
              var mergedContext = processChildContext(instance, Component, previousContext, childContextTypes);
              task.legacyContext = mergedContext;
              renderNodeDestructive(request, task, nextChildren);
              task.legacyContext = previousContext;
              return;
            }
          }
          renderNodeDestructive(request, task, nextChildren);
        }
        function renderClassComponent(request, task, Component, props) {
          pushClassComponentStackInDEV(task, Component);
          var maskedContext = getMaskedContext(Component, task.legacyContext);
          var instance = constructClassInstance(Component, props, maskedContext);
          mountClassInstance(instance, Component, props, maskedContext);
          finishClassComponent(request, task, instance, Component, props);
          popComponentStackInDEV(task);
        }
        var didWarnAboutBadClass = {};
        var didWarnAboutModulePatternComponent = {};
        var didWarnAboutContextTypeOnFunctionComponent = {};
        var didWarnAboutGetDerivedStateOnFunctionComponent = {};
        var didWarnAboutReassigningProps = false;
        var didWarnAboutGenerators = false;
        var didWarnAboutMaps = false;
        var hasWarnedAboutUsingContextAsConsumer = false;
        function renderIndeterminateComponent(request, task, Component, props) {
          var legacyContext;
          {
            legacyContext = getMaskedContext(Component, task.legacyContext);
          }
          pushFunctionComponentStackInDEV(task, Component);
          {
            if (Component.prototype && typeof Component.prototype.render === "function") {
              var componentName = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutBadClass[componentName]) {
                error("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", componentName, componentName);
                didWarnAboutBadClass[componentName] = true;
              }
            }
          }
          var value = renderWithHooks(request, task, Component, props, legacyContext);
          var hasId = checkDidRenderIdHook();
          {
            if (typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0) {
              var _componentName = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutModulePatternComponent[_componentName]) {
                error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName, _componentName, _componentName);
                didWarnAboutModulePatternComponent[_componentName] = true;
              }
            }
          }
          if (
            // Run these checks in production only if the flag is off.
            // Eventually we'll delete this branch altogether.
            typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0
          ) {
            {
              var _componentName2 = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutModulePatternComponent[_componentName2]) {
                error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName2, _componentName2, _componentName2);
                didWarnAboutModulePatternComponent[_componentName2] = true;
              }
            }
            mountClassInstance(value, Component, props, legacyContext);
            finishClassComponent(request, task, value, Component, props);
          } else {
            {
              validateFunctionComponentInDev(Component);
            }
            if (hasId) {
              var prevTreeContext = task.treeContext;
              var totalChildren = 1;
              var index = 0;
              task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
              try {
                renderNodeDestructive(request, task, value);
              } finally {
                task.treeContext = prevTreeContext;
              }
            } else {
              renderNodeDestructive(request, task, value);
            }
          }
          popComponentStackInDEV(task);
        }
        function validateFunctionComponentInDev(Component) {
          {
            if (Component) {
              if (Component.childContextTypes) {
                error("%s(...): childContextTypes cannot be defined on a function component.", Component.displayName || Component.name || "Component");
              }
            }
            if (typeof Component.getDerivedStateFromProps === "function") {
              var _componentName3 = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3]) {
                error("%s: Function components do not support getDerivedStateFromProps.", _componentName3);
                didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3] = true;
              }
            }
            if (typeof Component.contextType === "object" && Component.contextType !== null) {
              var _componentName4 = getComponentNameFromType(Component) || "Unknown";
              if (!didWarnAboutContextTypeOnFunctionComponent[_componentName4]) {
                error("%s: Function components do not support contextType.", _componentName4);
                didWarnAboutContextTypeOnFunctionComponent[_componentName4] = true;
              }
            }
          }
        }
        function resolveDefaultProps(Component, baseProps) {
          if (Component && Component.defaultProps) {
            var props = assign({}, baseProps);
            var defaultProps = Component.defaultProps;
            for (var propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
            return props;
          }
          return baseProps;
        }
        function renderForwardRef(request, task, type, props, ref) {
          pushFunctionComponentStackInDEV(task, type.render);
          var children = renderWithHooks(request, task, type.render, props, ref);
          var hasId = checkDidRenderIdHook();
          if (hasId) {
            var prevTreeContext = task.treeContext;
            var totalChildren = 1;
            var index = 0;
            task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
            try {
              renderNodeDestructive(request, task, children);
            } finally {
              task.treeContext = prevTreeContext;
            }
          } else {
            renderNodeDestructive(request, task, children);
          }
          popComponentStackInDEV(task);
        }
        function renderMemo(request, task, type, props, ref) {
          var innerType = type.type;
          var resolvedProps = resolveDefaultProps(innerType, props);
          renderElement(request, task, innerType, resolvedProps, ref);
        }
        function renderContextConsumer(request, task, context, props) {
          {
            if (context._context === void 0) {
              if (context !== context.Consumer) {
                if (!hasWarnedAboutUsingContextAsConsumer) {
                  hasWarnedAboutUsingContextAsConsumer = true;
                  error("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
                }
              }
            } else {
              context = context._context;
            }
          }
          var render = props.children;
          {
            if (typeof render !== "function") {
              error("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it.");
            }
          }
          var newValue = readContext(context);
          var newChildren = render(newValue);
          renderNodeDestructive(request, task, newChildren);
        }
        function renderContextProvider(request, task, type, props) {
          var context = type._context;
          var value = props.value;
          var children = props.children;
          var prevSnapshot;
          {
            prevSnapshot = task.context;
          }
          task.context = pushProvider(context, value);
          renderNodeDestructive(request, task, children);
          task.context = popProvider(context);
          {
            if (prevSnapshot !== task.context) {
              error("Popping the context provider did not return back to the original snapshot. This is a bug in React.");
            }
          }
        }
        function renderLazyComponent(request, task, lazyComponent, props, ref) {
          pushBuiltInComponentStackInDEV(task, "Lazy");
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;
          var Component = init(payload);
          var resolvedProps = resolveDefaultProps(Component, props);
          renderElement(request, task, Component, resolvedProps, ref);
          popComponentStackInDEV(task);
        }
        function renderElement(request, task, type, props, ref) {
          if (typeof type === "function") {
            if (shouldConstruct$1(type)) {
              renderClassComponent(request, task, type, props);
              return;
            } else {
              renderIndeterminateComponent(request, task, type, props);
              return;
            }
          }
          if (typeof type === "string") {
            renderHostElement(request, task, type, props);
            return;
          }
          switch (type) {
            case REACT_LEGACY_HIDDEN_TYPE:
            case REACT_DEBUG_TRACING_MODE_TYPE:
            case REACT_STRICT_MODE_TYPE:
            case REACT_PROFILER_TYPE:
            case REACT_FRAGMENT_TYPE: {
              renderNodeDestructive(request, task, props.children);
              return;
            }
            case REACT_SUSPENSE_LIST_TYPE: {
              pushBuiltInComponentStackInDEV(task, "SuspenseList");
              renderNodeDestructive(request, task, props.children);
              popComponentStackInDEV(task);
              return;
            }
            case REACT_SCOPE_TYPE: {
              throw new Error("ReactDOMServer does not yet support scope components.");
            }
            case REACT_SUSPENSE_TYPE: {
              {
                renderSuspenseBoundary(request, task, props);
              }
              return;
            }
          }
          if (typeof type === "object" && type !== null) {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE: {
                renderForwardRef(request, task, type, props, ref);
                return;
              }
              case REACT_MEMO_TYPE: {
                renderMemo(request, task, type, props, ref);
                return;
              }
              case REACT_PROVIDER_TYPE: {
                renderContextProvider(request, task, type, props);
                return;
              }
              case REACT_CONTEXT_TYPE: {
                renderContextConsumer(request, task, type, props);
                return;
              }
              case REACT_LAZY_TYPE: {
                renderLazyComponent(request, task, type, props);
                return;
              }
            }
          }
          var info = "";
          {
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
          }
          throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (type == null ? type : typeof type) + "." + info));
        }
        function validateIterable(iterable, iteratorFn) {
          {
            if (typeof Symbol === "function" && // $FlowFixMe Flow doesn't know about toStringTag
            iterable[Symbol.toStringTag] === "Generator") {
              if (!didWarnAboutGenerators) {
                error("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers.");
              }
              didWarnAboutGenerators = true;
            }
            if (iterable.entries === iteratorFn) {
              if (!didWarnAboutMaps) {
                error("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
              }
              didWarnAboutMaps = true;
            }
          }
        }
        function renderNodeDestructive(request, task, node) {
          {
            try {
              return renderNodeDestructiveImpl(request, task, node);
            } catch (x) {
              if (typeof x === "object" && x !== null && typeof x.then === "function") ;
              else {
                lastBoundaryErrorComponentStackDev = lastBoundaryErrorComponentStackDev !== null ? lastBoundaryErrorComponentStackDev : getCurrentStackInDEV();
              }
              throw x;
            }
          }
        }
        function renderNodeDestructiveImpl(request, task, node) {
          task.node = node;
          if (typeof node === "object" && node !== null) {
            switch (node.$$typeof) {
              case REACT_ELEMENT_TYPE: {
                var element = node;
                var type = element.type;
                var props = element.props;
                var ref = element.ref;
                renderElement(request, task, type, props, ref);
                return;
              }
              case REACT_PORTAL_TYPE:
                throw new Error("Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.");
              case REACT_LAZY_TYPE: {
                var lazyNode = node;
                var payload = lazyNode._payload;
                var init = lazyNode._init;
                var resolvedNode;
                {
                  try {
                    resolvedNode = init(payload);
                  } catch (x) {
                    if (typeof x === "object" && x !== null && typeof x.then === "function") {
                      pushBuiltInComponentStackInDEV(task, "Lazy");
                    }
                    throw x;
                  }
                }
                renderNodeDestructive(request, task, resolvedNode);
                return;
              }
            }
            if (isArray(node)) {
              renderChildrenArray(request, task, node);
              return;
            }
            var iteratorFn = getIteratorFn(node);
            if (iteratorFn) {
              {
                validateIterable(node, iteratorFn);
              }
              var iterator = iteratorFn.call(node);
              if (iterator) {
                var step = iterator.next();
                if (!step.done) {
                  var children = [];
                  do {
                    children.push(step.value);
                    step = iterator.next();
                  } while (!step.done);
                  renderChildrenArray(request, task, children);
                  return;
                }
                return;
              }
            }
            var childString = Object.prototype.toString.call(node);
            throw new Error("Objects are not valid as a React child (found: " + (childString === "[object Object]" ? "object with keys {" + Object.keys(node).join(", ") + "}" : childString) + "). If you meant to render a collection of children, use an array instead.");
          }
          if (typeof node === "string") {
            var segment = task.blockedSegment;
            segment.lastPushedText = pushTextInstance(task.blockedSegment.chunks, node, request.responseState, segment.lastPushedText);
            return;
          }
          if (typeof node === "number") {
            var _segment = task.blockedSegment;
            _segment.lastPushedText = pushTextInstance(task.blockedSegment.chunks, "" + node, request.responseState, _segment.lastPushedText);
            return;
          }
          {
            if (typeof node === "function") {
              error("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
            }
          }
        }
        function renderChildrenArray(request, task, children) {
          var totalChildren = children.length;
          for (var i = 0; i < totalChildren; i++) {
            var prevTreeContext = task.treeContext;
            task.treeContext = pushTreeContext(prevTreeContext, totalChildren, i);
            try {
              renderNode(request, task, children[i]);
            } finally {
              task.treeContext = prevTreeContext;
            }
          }
        }
        function spawnNewSuspendedTask(request, task, x) {
          var segment = task.blockedSegment;
          var insertionIndex = segment.chunks.length;
          var newSegment = createPendingSegment(
            request,
            insertionIndex,
            null,
            segment.formatContext,
            // Adopt the parent segment's leading text embed
            segment.lastPushedText,
            // Assume we are text embedded at the trailing edge
            true
          );
          segment.children.push(newSegment);
          segment.lastPushedText = false;
          var newTask = createTask(request, task.node, task.blockedBoundary, newSegment, task.abortSet, task.legacyContext, task.context, task.treeContext);
          {
            if (task.componentStack !== null) {
              newTask.componentStack = task.componentStack.parent;
            }
          }
          var ping = newTask.ping;
          x.then(ping, ping);
        }
        function renderNode(request, task, node) {
          var previousFormatContext = task.blockedSegment.formatContext;
          var previousLegacyContext = task.legacyContext;
          var previousContext = task.context;
          var previousComponentStack = null;
          {
            previousComponentStack = task.componentStack;
          }
          try {
            return renderNodeDestructive(request, task, node);
          } catch (x) {
            resetHooksState();
            if (typeof x === "object" && x !== null && typeof x.then === "function") {
              spawnNewSuspendedTask(request, task, x);
              task.blockedSegment.formatContext = previousFormatContext;
              task.legacyContext = previousLegacyContext;
              task.context = previousContext;
              switchContext(previousContext);
              {
                task.componentStack = previousComponentStack;
              }
              return;
            } else {
              task.blockedSegment.formatContext = previousFormatContext;
              task.legacyContext = previousLegacyContext;
              task.context = previousContext;
              switchContext(previousContext);
              {
                task.componentStack = previousComponentStack;
              }
              throw x;
            }
          }
        }
        function erroredTask(request, boundary, segment, error2) {
          var errorDigest = logRecoverableError(request, error2);
          if (boundary === null) {
            fatalError(request, error2);
          } else {
            boundary.pendingTasks--;
            if (!boundary.forceClientRender) {
              boundary.forceClientRender = true;
              boundary.errorDigest = errorDigest;
              {
                captureBoundaryErrorDetailsDev(boundary, error2);
              }
              if (boundary.parentFlushed) {
                request.clientRenderedBoundaries.push(boundary);
              }
            }
          }
          request.allPendingTasks--;
          if (request.allPendingTasks === 0) {
            var onAllReady = request.onAllReady;
            onAllReady();
          }
        }
        function abortTaskSoft(task) {
          var request = this;
          var boundary = task.blockedBoundary;
          var segment = task.blockedSegment;
          segment.status = ABORTED;
          finishedTask(request, boundary, segment);
        }
        function abortTask(task, request, reason) {
          var boundary = task.blockedBoundary;
          var segment = task.blockedSegment;
          segment.status = ABORTED;
          if (boundary === null) {
            request.allPendingTasks--;
            if (request.status !== CLOSED) {
              request.status = CLOSED;
              if (request.destination !== null) {
                close(request.destination);
              }
            }
          } else {
            boundary.pendingTasks--;
            if (!boundary.forceClientRender) {
              boundary.forceClientRender = true;
              var _error = reason === void 0 ? new Error("The render was aborted by the server without a reason.") : reason;
              boundary.errorDigest = request.onError(_error);
              {
                var errorPrefix = "The server did not finish this Suspense boundary: ";
                if (_error && typeof _error.message === "string") {
                  _error = errorPrefix + _error.message;
                } else {
                  _error = errorPrefix + String(_error);
                }
                var previousTaskInDev = currentTaskInDEV;
                currentTaskInDEV = task;
                try {
                  captureBoundaryErrorDetailsDev(boundary, _error);
                } finally {
                  currentTaskInDEV = previousTaskInDev;
                }
              }
              if (boundary.parentFlushed) {
                request.clientRenderedBoundaries.push(boundary);
              }
            }
            boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
              return abortTask(fallbackTask, request, reason);
            });
            boundary.fallbackAbortableTasks.clear();
            request.allPendingTasks--;
            if (request.allPendingTasks === 0) {
              var onAllReady = request.onAllReady;
              onAllReady();
            }
          }
        }
        function queueCompletedSegment(boundary, segment) {
          if (segment.chunks.length === 0 && segment.children.length === 1 && segment.children[0].boundary === null) {
            var childSegment = segment.children[0];
            childSegment.id = segment.id;
            childSegment.parentFlushed = true;
            if (childSegment.status === COMPLETED) {
              queueCompletedSegment(boundary, childSegment);
            }
          } else {
            var completedSegments = boundary.completedSegments;
            completedSegments.push(segment);
          }
        }
        function finishedTask(request, boundary, segment) {
          if (boundary === null) {
            if (segment.parentFlushed) {
              if (request.completedRootSegment !== null) {
                throw new Error("There can only be one root segment. This is a bug in React.");
              }
              request.completedRootSegment = segment;
            }
            request.pendingRootTasks--;
            if (request.pendingRootTasks === 0) {
              request.onShellError = noop$1;
              var onShellReady = request.onShellReady;
              onShellReady();
            }
          } else {
            boundary.pendingTasks--;
            if (boundary.forceClientRender) ;
            else if (boundary.pendingTasks === 0) {
              if (segment.parentFlushed) {
                if (segment.status === COMPLETED) {
                  queueCompletedSegment(boundary, segment);
                }
              }
              if (boundary.parentFlushed) {
                request.completedBoundaries.push(boundary);
              }
              boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request);
              boundary.fallbackAbortableTasks.clear();
            } else {
              if (segment.parentFlushed) {
                if (segment.status === COMPLETED) {
                  queueCompletedSegment(boundary, segment);
                  var completedSegments = boundary.completedSegments;
                  if (completedSegments.length === 1) {
                    if (boundary.parentFlushed) {
                      request.partialBoundaries.push(boundary);
                    }
                  }
                }
              }
            }
          }
          request.allPendingTasks--;
          if (request.allPendingTasks === 0) {
            var onAllReady = request.onAllReady;
            onAllReady();
          }
        }
        function retryTask(request, task) {
          var segment = task.blockedSegment;
          if (segment.status !== PENDING) {
            return;
          }
          switchContext(task.context);
          var prevTaskInDEV = null;
          {
            prevTaskInDEV = currentTaskInDEV;
            currentTaskInDEV = task;
          }
          try {
            renderNodeDestructive(request, task, task.node);
            pushSegmentFinale(segment.chunks, request.responseState, segment.lastPushedText, segment.textEmbedded);
            task.abortSet.delete(task);
            segment.status = COMPLETED;
            finishedTask(request, task.blockedBoundary, segment);
          } catch (x) {
            resetHooksState();
            if (typeof x === "object" && x !== null && typeof x.then === "function") {
              var ping = task.ping;
              x.then(ping, ping);
            } else {
              task.abortSet.delete(task);
              segment.status = ERRORED;
              erroredTask(request, task.blockedBoundary, segment, x);
            }
          } finally {
            {
              currentTaskInDEV = prevTaskInDEV;
            }
          }
        }
        function performWork(request) {
          if (request.status === CLOSED) {
            return;
          }
          var prevContext = getActiveContext();
          var prevDispatcher = ReactCurrentDispatcher$1.current;
          ReactCurrentDispatcher$1.current = Dispatcher;
          var prevGetCurrentStackImpl;
          {
            prevGetCurrentStackImpl = ReactDebugCurrentFrame$1.getCurrentStack;
            ReactDebugCurrentFrame$1.getCurrentStack = getCurrentStackInDEV;
          }
          var prevResponseState = currentResponseState;
          setCurrentResponseState(request.responseState);
          try {
            var pingedTasks = request.pingedTasks;
            var i;
            for (i = 0; i < pingedTasks.length; i++) {
              var task = pingedTasks[i];
              retryTask(request, task);
            }
            pingedTasks.splice(0, i);
            if (request.destination !== null) {
              flushCompletedQueues(request, request.destination);
            }
          } catch (error2) {
            logRecoverableError(request, error2);
            fatalError(request, error2);
          } finally {
            setCurrentResponseState(prevResponseState);
            ReactCurrentDispatcher$1.current = prevDispatcher;
            {
              ReactDebugCurrentFrame$1.getCurrentStack = prevGetCurrentStackImpl;
            }
            if (prevDispatcher === Dispatcher) {
              switchContext(prevContext);
            }
          }
        }
        function flushSubtree(request, destination, segment) {
          segment.parentFlushed = true;
          switch (segment.status) {
            case PENDING: {
              var segmentID = segment.id = request.nextSegmentId++;
              segment.lastPushedText = false;
              segment.textEmbedded = false;
              return writePlaceholder(destination, request.responseState, segmentID);
            }
            case COMPLETED: {
              segment.status = FLUSHED;
              var r = true;
              var chunks = segment.chunks;
              var chunkIdx = 0;
              var children = segment.children;
              for (var childIdx = 0; childIdx < children.length; childIdx++) {
                var nextChild = children[childIdx];
                for (; chunkIdx < nextChild.index; chunkIdx++) {
                  writeChunk(destination, chunks[chunkIdx]);
                }
                r = flushSegment(request, destination, nextChild);
              }
              for (; chunkIdx < chunks.length - 1; chunkIdx++) {
                writeChunk(destination, chunks[chunkIdx]);
              }
              if (chunkIdx < chunks.length) {
                r = writeChunkAndReturn(destination, chunks[chunkIdx]);
              }
              return r;
            }
            default: {
              throw new Error("Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.");
            }
          }
        }
        function flushSegment(request, destination, segment) {
          var boundary = segment.boundary;
          if (boundary === null) {
            return flushSubtree(request, destination, segment);
          }
          boundary.parentFlushed = true;
          if (boundary.forceClientRender) {
            writeStartClientRenderedSuspenseBoundary(destination, request.responseState, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
            flushSubtree(request, destination, segment);
            return writeEndClientRenderedSuspenseBoundary(destination, request.responseState);
          } else if (boundary.pendingTasks > 0) {
            boundary.rootSegmentID = request.nextSegmentId++;
            if (boundary.completedSegments.length > 0) {
              request.partialBoundaries.push(boundary);
            }
            var id = boundary.id = assignSuspenseBoundaryID(request.responseState);
            writeStartPendingSuspenseBoundary(destination, request.responseState, id);
            flushSubtree(request, destination, segment);
            return writeEndPendingSuspenseBoundary(destination, request.responseState);
          } else if (boundary.byteSize > request.progressiveChunkSize) {
            boundary.rootSegmentID = request.nextSegmentId++;
            request.completedBoundaries.push(boundary);
            writeStartPendingSuspenseBoundary(destination, request.responseState, boundary.id);
            flushSubtree(request, destination, segment);
            return writeEndPendingSuspenseBoundary(destination, request.responseState);
          } else {
            writeStartCompletedSuspenseBoundary(destination, request.responseState);
            var completedSegments = boundary.completedSegments;
            if (completedSegments.length !== 1) {
              throw new Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
            }
            var contentSegment = completedSegments[0];
            flushSegment(request, destination, contentSegment);
            return writeEndCompletedSuspenseBoundary(destination, request.responseState);
          }
        }
        function flushClientRenderedBoundary(request, destination, boundary) {
          return writeClientRenderBoundaryInstruction(destination, request.responseState, boundary.id, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
        }
        function flushSegmentContainer(request, destination, segment) {
          writeStartSegment(destination, request.responseState, segment.formatContext, segment.id);
          flushSegment(request, destination, segment);
          return writeEndSegment(destination, segment.formatContext);
        }
        function flushCompletedBoundary(request, destination, boundary) {
          var completedSegments = boundary.completedSegments;
          var i = 0;
          for (; i < completedSegments.length; i++) {
            var segment = completedSegments[i];
            flushPartiallyCompletedSegment(request, destination, boundary, segment);
          }
          completedSegments.length = 0;
          return writeCompletedBoundaryInstruction(destination, request.responseState, boundary.id, boundary.rootSegmentID);
        }
        function flushPartialBoundary(request, destination, boundary) {
          var completedSegments = boundary.completedSegments;
          var i = 0;
          for (; i < completedSegments.length; i++) {
            var segment = completedSegments[i];
            if (!flushPartiallyCompletedSegment(request, destination, boundary, segment)) {
              i++;
              completedSegments.splice(0, i);
              return false;
            }
          }
          completedSegments.splice(0, i);
          return true;
        }
        function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
          if (segment.status === FLUSHED) {
            return true;
          }
          var segmentID = segment.id;
          if (segmentID === -1) {
            var rootSegmentID = segment.id = boundary.rootSegmentID;
            if (rootSegmentID === -1) {
              throw new Error("A root segment ID must have been assigned by now. This is a bug in React.");
            }
            return flushSegmentContainer(request, destination, segment);
          } else {
            flushSegmentContainer(request, destination, segment);
            return writeCompletedSegmentInstruction(destination, request.responseState, segmentID);
          }
        }
        function flushCompletedQueues(request, destination) {
          beginWriting();
          try {
            var completedRootSegment = request.completedRootSegment;
            if (completedRootSegment !== null && request.pendingRootTasks === 0) {
              flushSegment(request, destination, completedRootSegment);
              request.completedRootSegment = null;
              writeCompletedRoot(destination, request.responseState);
            }
            var clientRenderedBoundaries = request.clientRenderedBoundaries;
            var i;
            for (i = 0; i < clientRenderedBoundaries.length; i++) {
              var boundary = clientRenderedBoundaries[i];
              if (!flushClientRenderedBoundary(request, destination, boundary)) {
                request.destination = null;
                i++;
                clientRenderedBoundaries.splice(0, i);
                return;
              }
            }
            clientRenderedBoundaries.splice(0, i);
            var completedBoundaries = request.completedBoundaries;
            for (i = 0; i < completedBoundaries.length; i++) {
              var _boundary = completedBoundaries[i];
              if (!flushCompletedBoundary(request, destination, _boundary)) {
                request.destination = null;
                i++;
                completedBoundaries.splice(0, i);
                return;
              }
            }
            completedBoundaries.splice(0, i);
            completeWriting(destination);
            beginWriting(destination);
            var partialBoundaries = request.partialBoundaries;
            for (i = 0; i < partialBoundaries.length; i++) {
              var _boundary2 = partialBoundaries[i];
              if (!flushPartialBoundary(request, destination, _boundary2)) {
                request.destination = null;
                i++;
                partialBoundaries.splice(0, i);
                return;
              }
            }
            partialBoundaries.splice(0, i);
            var largeBoundaries = request.completedBoundaries;
            for (i = 0; i < largeBoundaries.length; i++) {
              var _boundary3 = largeBoundaries[i];
              if (!flushCompletedBoundary(request, destination, _boundary3)) {
                request.destination = null;
                i++;
                largeBoundaries.splice(0, i);
                return;
              }
            }
            largeBoundaries.splice(0, i);
          } finally {
            completeWriting(destination);
            if (request.allPendingTasks === 0 && request.pingedTasks.length === 0 && request.clientRenderedBoundaries.length === 0 && request.completedBoundaries.length === 0) {
              {
                if (request.abortableTasks.size !== 0) {
                  error("There was still abortable task at the root when we closed. This is a bug in React.");
                }
              }
              close(destination);
            }
          }
        }
        function startWork(request) {
          scheduleWork(function() {
            return performWork(request);
          });
        }
        function startFlowing(request, destination) {
          if (request.status === CLOSING) {
            request.status = CLOSED;
            closeWithError(destination, request.fatalError);
            return;
          }
          if (request.status === CLOSED) {
            return;
          }
          if (request.destination !== null) {
            return;
          }
          request.destination = destination;
          try {
            flushCompletedQueues(request, destination);
          } catch (error2) {
            logRecoverableError(request, error2);
            fatalError(request, error2);
          }
        }
        function abort(request, reason) {
          try {
            var abortableTasks = request.abortableTasks;
            abortableTasks.forEach(function(task) {
              return abortTask(task, request, reason);
            });
            abortableTasks.clear();
            if (request.destination !== null) {
              flushCompletedQueues(request, request.destination);
            }
          } catch (error2) {
            logRecoverableError(request, error2);
            fatalError(request, error2);
          }
        }
        function renderToReadableStream(children, options) {
          return new Promise(function(resolve, reject) {
            var onFatalError;
            var onAllReady;
            var allReady = new Promise(function(res, rej) {
              onAllReady = res;
              onFatalError = rej;
            });
            function onShellReady() {
              var stream = new ReadableStream(
                {
                  type: "bytes",
                  pull: function(controller) {
                    startFlowing(request, controller);
                  },
                  cancel: function(reason) {
                    abort(request);
                  }
                },
                // $FlowFixMe size() methods are not allowed on byte streams.
                {
                  highWaterMark: 0
                }
              );
              stream.allReady = allReady;
              resolve(stream);
            }
            function onShellError(error2) {
              allReady.catch(function() {
              });
              reject(error2);
            }
            var request = createRequest(children, createResponseState(options ? options.identifierPrefix : void 0, options ? options.nonce : void 0, options ? options.bootstrapScriptContent : void 0, options ? options.bootstrapScripts : void 0, options ? options.bootstrapModules : void 0), createRootFormatContext(options ? options.namespaceURI : void 0), options ? options.progressiveChunkSize : void 0, options ? options.onError : void 0, onAllReady, onShellReady, onShellError, onFatalError);
            if (options && options.signal) {
              var signal = options.signal;
              var listener = function() {
                abort(request, signal.reason);
                signal.removeEventListener("abort", listener);
              };
              signal.addEventListener("abort", listener);
            }
            startWork(request);
          });
        }
        exports.renderToReadableStream = renderToReadableStream;
        exports.version = ReactVersion;
      })();
    }
  }
});

// node_modules/react-dom/server.browser.js
var require_server_browser = __commonJS({
  "node_modules/react-dom/server.browser.js"(exports) {
    "use strict";
    var l;
    var s;
    if (false) {
      l = null;
      s = null;
    } else {
      l = require_react_dom_server_legacy_browser_development();
      s = require_react_dom_server_browser_development();
    }
    exports.version = l.version;
    exports.renderToString = l.renderToString;
    exports.renderToStaticMarkup = l.renderToStaticMarkup;
    exports.renderToNodeStream = l.renderToNodeStream;
    exports.renderToStaticNodeStream = l.renderToStaticNodeStream;
    exports.renderToReadableStream = s.renderToReadableStream;
  }
});

// node_modules/ag-grid-react/lib/shared/keyGenerator.js
var require_keyGenerator = __commonJS({
  "node_modules/ag-grid-react/lib/shared/keyGenerator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var counter = 0;
    function generateNewKey() {
      return "agPortalKey_" + ++counter;
    }
    exports.default = generateNewKey;
  }
});

// node_modules/ag-grid-react/lib/legacy/legacyReactComponent.js
var require_legacyReactComponent = __commonJS({
  "node_modules/ag-grid-react/lib/legacy/legacyReactComponent.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LegacyReactComponent = void 0;
    var react_1 = require_react();
    var react_dom_1 = require_react_dom();
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var reactComponent_1 = require_reactComponent();
    var server_1 = require_server_browser();
    var keyGenerator_1 = __importDefault(require_keyGenerator());
    var LegacyReactComponent = (
      /** @class */
      function(_super) {
        __extends(LegacyReactComponent2, _super);
        function LegacyReactComponent2(reactComponent, parentComponent, portalManager, componentType) {
          var _this = _super.call(this, reactComponent, portalManager, componentType) || this;
          _this.staticMarkup = null;
          _this.staticRenderTime = 0;
          _this.parentComponent = parentComponent;
          return _this;
        }
        LegacyReactComponent2.prototype.init = function(params) {
          var _this = this;
          this.eParentElement = this.createParentElement(params);
          this.renderStaticMarkup(params);
          return new ag_grid_community_1.AgPromise(function(resolve) {
            return _this.createReactComponent(params, resolve);
          });
        };
        LegacyReactComponent2.prototype.createReactComponent = function(params, resolve) {
          var _this = this;
          if (!this.isStatelessComponent()) {
            params.ref = function(element) {
              _this.componentInstance = element;
              _this.addParentContainerStyleAndClasses();
              _this.removeStaticMarkup();
            };
          }
          var reactComponent = react_1.createElement(this.reactComponent, params);
          var portal = react_dom_1.createPortal(
            reactComponent,
            this.eParentElement,
            keyGenerator_1.default()
            // fixed deltaRowModeRefreshCompRenderer
          );
          this.portal = portal;
          this.portalManager.mountReactPortal(portal, this, function(value) {
            resolve(value);
            if (_this.isStatelessComponent()) {
              if (_this.isSlowRenderer()) {
                _this.removeStaticMarkup();
              }
              setTimeout(function() {
                _this.removeStaticMarkup();
              });
            }
          });
        };
        LegacyReactComponent2.prototype.fallbackMethodAvailable = function(name) {
          return false;
        };
        LegacyReactComponent2.prototype.fallbackMethod = function(name, params) {
        };
        LegacyReactComponent2.prototype.isSlowRenderer = function() {
          return this.staticRenderTime >= LegacyReactComponent2.SLOW_RENDERING_THRESHOLD;
        };
        LegacyReactComponent2.prototype.isNullValue = function() {
          return this.staticMarkup === "";
        };
        LegacyReactComponent2.prototype.renderStaticMarkup = function(params) {
          if (this.parentComponent.isDisableStaticMarkup() || !this.componentType.cellRenderer) {
            return;
          }
          var originalConsoleError = console.error;
          var reactComponent = react_1.createElement(this.reactComponent, params);
          try {
            console.error = function() {
            };
            var start = Date.now();
            var staticMarkup = server_1.renderToStaticMarkup(reactComponent);
            this.staticRenderTime = Date.now() - start;
            console.error = originalConsoleError;
            if (staticMarkup === "") {
              this.staticMarkup = staticMarkup;
            } else {
              if (staticMarkup) {
                this.staticMarkup = document.createElement("span");
                this.staticMarkup.innerHTML = staticMarkup;
                this.eParentElement.appendChild(this.staticMarkup);
              }
            }
          } catch (e) {
          } finally {
            console.error = originalConsoleError;
          }
        };
        LegacyReactComponent2.prototype.removeStaticMarkup = function() {
          if (this.parentComponent.isDisableStaticMarkup() || !this.componentType.cellRenderer) {
            return;
          }
          if (this.staticMarkup) {
            if (this.staticMarkup.remove) {
              this.staticMarkup.remove();
              this.staticMarkup = null;
            } else if (this.eParentElement.removeChild) {
              this.eParentElement.removeChild(this.staticMarkup);
              this.staticMarkup = null;
            }
          }
        };
        LegacyReactComponent2.prototype.rendered = function() {
          return this.isNullValue() || !!this.staticMarkup || this.isStatelessComponent() && this.statelessComponentRendered() || !!(!this.isStatelessComponent() && this.getFrameworkComponentInstance());
        };
        LegacyReactComponent2.SLOW_RENDERING_THRESHOLD = 3;
        return LegacyReactComponent2;
      }(reactComponent_1.ReactComponent)
    );
    exports.LegacyReactComponent = LegacyReactComponent;
  }
});

// node_modules/ag-grid-react/lib/shared/newReactComponent.js
var require_newReactComponent = __commonJS({
  "node_modules/ag-grid-react/lib/shared/newReactComponent.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NewReactComponent = void 0;
    var react_1 = require_react();
    var react_dom_1 = require_react_dom();
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var reactComponent_1 = require_reactComponent();
    var server_1 = require_server_browser();
    var keyGenerator_1 = __importDefault(require_keyGenerator());
    var NewReactComponent = (
      /** @class */
      function(_super) {
        __extends(NewReactComponent2, _super);
        function NewReactComponent2(reactComponent, parentComponent, componentType) {
          var _this = _super.call(this, reactComponent, parentComponent, componentType) || this;
          _this.oldPortal = null;
          _this.key = keyGenerator_1.default();
          _this.portalKey = keyGenerator_1.default();
          return _this;
        }
        NewReactComponent2.prototype.init = function(params) {
          var _this = this;
          this.eParentElement = this.createParentElement(params);
          this.params = params;
          this.createOrUpdatePortal(params);
          return new ag_grid_community_1.AgPromise(function(resolve) {
            return _this.createReactComponent(resolve);
          });
        };
        NewReactComponent2.prototype.createOrUpdatePortal = function(params) {
          var _this = this;
          if (!this.isStatelessComponent()) {
            params.ref = function(element) {
              _this.componentInstance = element;
              _this.addParentContainerStyleAndClasses();
            };
          }
          this.reactElement = react_1.createElement(this.reactComponent, __assign(__assign({}, params), { key: this.key }));
          this.portal = react_dom_1.createPortal(
            this.reactElement,
            this.eParentElement,
            this.portalKey
            // fixed deltaRowModeRefreshCompRenderer
          );
        };
        NewReactComponent2.prototype.createReactComponent = function(resolve) {
          this.portalManager.mountReactPortal(this.portal, this, function(value) {
            resolve(value);
          });
        };
        NewReactComponent2.prototype.isNullValue = function() {
          return this.valueRenderedIsNull(this.params);
        };
        NewReactComponent2.prototype.rendered = function() {
          return this.isStatelessComponent() && this.statelessComponentRendered() || !!(!this.isStatelessComponent() && this.getFrameworkComponentInstance());
        };
        NewReactComponent2.prototype.valueRenderedIsNull = function(params) {
          if (!this.componentType.cellRenderer) {
            return false;
          }
          var originalConsoleError = console.error;
          try {
            console.error = function() {
            };
            var staticMarkup = server_1.renderToStaticMarkup(react_1.createElement(this.reactComponent, params));
            return staticMarkup === "";
          } catch (ignore) {
          } finally {
            console.error = originalConsoleError;
          }
          return false;
        };
        NewReactComponent2.prototype.refreshComponent = function(args) {
          this.oldPortal = this.portal;
          this.createOrUpdatePortal(args);
          this.portalManager.updateReactPortal(this.oldPortal, this.portal);
        };
        NewReactComponent2.prototype.fallbackMethod = function(name, params) {
          var method = this[name + "Component"];
          if (!!method) {
            return method.bind(this)(params);
          }
        };
        NewReactComponent2.prototype.fallbackMethodAvailable = function(name) {
          var method = this[name + "Component"];
          return !!method;
        };
        return NewReactComponent2;
      }(reactComponent_1.ReactComponent)
    );
    exports.NewReactComponent = NewReactComponent;
  }
});

// node_modules/ag-grid-react/lib/shared/portalManager.js
var require_portalManager = __commonJS({
  "node_modules/ag-grid-react/lib/shared/portalManager.js"(exports) {
    "use strict";
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PortalManager = exports.LegacyPortalManager = void 0;
    var LegacyPortalManager = (
      /** @class */
      function() {
        function LegacyPortalManager2(parent, wrappingElement, maxComponentCreationTimeMs) {
          this.destroyed = false;
          this.portals = [];
          this.hasPendingPortalUpdate = false;
          this.wrappingElement = wrappingElement ? wrappingElement : "div";
          this.parent = parent;
          this.maxComponentCreationTimeMs = maxComponentCreationTimeMs ? maxComponentCreationTimeMs : LegacyPortalManager2.MAX_COMPONENT_CREATION_TIME_IN_MS;
        }
        LegacyPortalManager2.prototype.getPortals = function() {
          return this.portals;
        };
        LegacyPortalManager2.prototype.destroy = function() {
          this.destroyed = true;
        };
        LegacyPortalManager2.prototype.destroyPortal = function(portal) {
          this.portals = this.portals.filter(function(curPortal) {
            return curPortal !== portal;
          });
          this.batchUpdate();
        };
        LegacyPortalManager2.prototype.getComponentWrappingElement = function() {
          return this.wrappingElement;
        };
        LegacyPortalManager2.prototype.mountReactPortal = function(portal, reactComponent, resolve) {
          this.portals = __spreadArray(__spreadArray([], this.portals), [portal]);
          this.waitForInstance(reactComponent, resolve);
          this.batchUpdate();
        };
        LegacyPortalManager2.prototype.updateReactPortal = function(oldPortal, newPortal) {
          this.portals[this.portals.indexOf(oldPortal)] = newPortal;
          this.batchUpdate();
        };
        LegacyPortalManager2.prototype.batchUpdate = function() {
          var _this = this;
          if (this.hasPendingPortalUpdate) {
            return;
          }
          setTimeout(function() {
            if (!_this.destroyed) {
              _this.parent.forceUpdate(function() {
                _this.hasPendingPortalUpdate = false;
              });
            }
          });
          this.hasPendingPortalUpdate = true;
        };
        LegacyPortalManager2.prototype.waitForInstance = function(reactComponent, resolve, startTime) {
          var _this = this;
          if (startTime === void 0) {
            startTime = Date.now();
          }
          if (this.destroyed) {
            resolve(null);
            return;
          }
          if (reactComponent.rendered()) {
            resolve(reactComponent);
          } else {
            if (Date.now() - startTime >= this.maxComponentCreationTimeMs && !this.hasPendingPortalUpdate) {
              if (reactComponent.isNullValue()) {
                resolve(reactComponent);
                return;
              }
              console.error("AG Grid: React Component '" + reactComponent.getReactComponentName() + "' not created within " + this.maxComponentCreationTimeMs + "ms");
              return;
            }
            window.setTimeout(function() {
              _this.waitForInstance(reactComponent, resolve, startTime);
            });
          }
        };
        LegacyPortalManager2.MAX_COMPONENT_CREATION_TIME_IN_MS = 1e3;
        return LegacyPortalManager2;
      }()
    );
    exports.LegacyPortalManager = LegacyPortalManager;
    var PortalManager = (
      /** @class */
      function() {
        function PortalManager2(refresher, wrappingElement, maxComponentCreationTimeMs) {
          this.destroyed = false;
          this.portals = [];
          this.hasPendingPortalUpdate = false;
          this.wrappingElement = wrappingElement ? wrappingElement : "div";
          this.refresher = refresher;
          this.maxComponentCreationTimeMs = maxComponentCreationTimeMs ? maxComponentCreationTimeMs : PortalManager2.MAX_COMPONENT_CREATION_TIME_IN_MS;
        }
        PortalManager2.prototype.getPortals = function() {
          return this.portals;
        };
        PortalManager2.prototype.destroy = function() {
          this.destroyed = true;
        };
        PortalManager2.prototype.destroyPortal = function(portal) {
          this.portals = this.portals.filter(function(curPortal) {
            return curPortal !== portal;
          });
          this.batchUpdate();
        };
        PortalManager2.prototype.getComponentWrappingElement = function() {
          return this.wrappingElement;
        };
        PortalManager2.prototype.mountReactPortal = function(portal, reactComponent, resolve) {
          this.portals = __spreadArray(__spreadArray([], this.portals), [portal]);
          this.waitForInstance(reactComponent, resolve);
          this.batchUpdate();
        };
        PortalManager2.prototype.updateReactPortal = function(oldPortal, newPortal) {
          this.portals[this.portals.indexOf(oldPortal)] = newPortal;
          this.batchUpdate();
        };
        PortalManager2.prototype.batchUpdate = function() {
          var _this = this;
          if (this.hasPendingPortalUpdate) {
            return;
          }
          setTimeout(function() {
            if (!_this.destroyed) {
              _this.refresher();
              _this.hasPendingPortalUpdate = false;
            }
          });
          this.hasPendingPortalUpdate = true;
        };
        PortalManager2.prototype.waitForInstance = function(reactComponent, resolve, startTime) {
          var _this = this;
          if (startTime === void 0) {
            startTime = Date.now();
          }
          if (this.destroyed) {
            resolve(null);
            return;
          }
          if (reactComponent.rendered()) {
            resolve(reactComponent);
          } else {
            if (Date.now() - startTime >= this.maxComponentCreationTimeMs && !this.hasPendingPortalUpdate) {
              if (reactComponent.isNullValue()) {
                resolve(reactComponent);
                return;
              }
              console.error("AG Grid: React Component '" + reactComponent.getReactComponentName() + "' not created within " + this.maxComponentCreationTimeMs + "ms");
              return;
            }
            window.setTimeout(function() {
              _this.waitForInstance(reactComponent, resolve, startTime);
            });
          }
        };
        PortalManager2.MAX_COMPONENT_CREATION_TIME_IN_MS = 1e3;
        return PortalManager2;
      }()
    );
    exports.PortalManager = PortalManager;
  }
});

// node_modules/ag-grid-react/lib/reactUi/beansContext.js
var require_beansContext = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/beansContext.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BeansContext = void 0;
    var react_1 = __importDefault(require_react());
    exports.BeansContext = react_1.default.createContext({});
  }
});

// node_modules/ag-grid-react/lib/reactUi/jsComp.js
var require_jsComp = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/jsComp.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createSyncJsComp = exports.showJsComp = void 0;
    var showJsComp = function(compDetails, context, eParent, ref) {
      var doNothing = !compDetails || compDetails.componentFromFramework || context.isDestroyed();
      if (doNothing) {
        return;
      }
      var promise = compDetails.newAgStackInstance();
      if (!promise) {
        return;
      }
      var comp;
      var compGui;
      var destroyed = false;
      promise.then(function(c) {
        if (destroyed) {
          context.destroyBean(c);
          return;
        }
        comp = c;
        compGui = comp.getGui();
        eParent.appendChild(compGui);
        setRef(ref, comp);
      });
      return function() {
        destroyed = true;
        if (!comp) {
          return;
        }
        if (compGui && compGui.parentElement) {
          compGui.parentElement.removeChild(compGui);
        }
        context.destroyBean(comp);
        if (ref) {
          setRef(ref, void 0);
        }
      };
    };
    exports.showJsComp = showJsComp;
    var setRef = function(ref, value) {
      if (!ref) {
        return;
      }
      if (ref instanceof Function) {
        var refCallback = ref;
        refCallback(value);
      } else {
        var refObj = ref;
        refObj.current = value;
      }
    };
    var createSyncJsComp = function(compDetails) {
      var promise = compDetails.newAgStackInstance();
      if (!promise) {
        return;
      }
      return promise.resolveNow(null, function(x) {
        return x;
      });
    };
    exports.createSyncJsComp = createSyncJsComp;
  }
});

// node_modules/ag-grid-react/lib/reactUi/utils.js
var require_utils = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/utils.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNextValueIfDifferent = exports.agFlushSync = exports.isComponentStateless = exports.CssClasses = exports.classesList = void 0;
    var react_dom_1 = __importDefault(require_react_dom());
    var classesList = function() {
      var list = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        list[_i] = arguments[_i];
      }
      var filtered = list.filter(function(s) {
        return s != null && s !== "";
      });
      return filtered.join(" ");
    };
    exports.classesList = classesList;
    var CssClasses = (
      /** @class */
      function() {
        function CssClasses2() {
          var _this = this;
          var initialClasses = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            initialClasses[_i] = arguments[_i];
          }
          this.classesMap = {};
          initialClasses.forEach(function(className) {
            _this.classesMap[className] = true;
          });
        }
        CssClasses2.prototype.setClass = function(className, on) {
          var nothingHasChanged = !!this.classesMap[className] == on;
          if (nothingHasChanged) {
            return this;
          }
          var res = new CssClasses2();
          res.classesMap = __assign({}, this.classesMap);
          res.classesMap[className] = on;
          return res;
        };
        CssClasses2.prototype.toString = function() {
          var _this = this;
          var res = Object.keys(this.classesMap).filter(function(key) {
            return _this.classesMap[key];
          }).join(" ");
          return res;
        };
        return CssClasses2;
      }()
    );
    exports.CssClasses = CssClasses;
    var isComponentStateless = function(Component) {
      var hasSymbol = function() {
        return typeof Symbol === "function" && Symbol.for;
      };
      var getMemoType = function() {
        return hasSymbol() ? Symbol.for("react.memo") : 60115;
      };
      return typeof Component === "function" && !(Component.prototype && Component.prototype.isReactComponent) || typeof Component === "object" && Component.$$typeof === getMemoType();
    };
    exports.isComponentStateless = isComponentStateless;
    var createRootAndFlushSyncAvailable = react_dom_1.default.createRoot != null && react_dom_1.default.flushSync != null;
    var agFlushSync = function(useFlushSync, fn) {
      if (createRootAndFlushSyncAvailable && useFlushSync) {
        react_dom_1.default.flushSync(fn);
      } else {
        fn();
      }
    };
    exports.agFlushSync = agFlushSync;
    function getNextValueIfDifferent(prev, next, maintainOrder) {
      if (next == null || prev == null) {
        return next;
      }
      if (prev === next || next.length === 0 && prev.length === 0) {
        return prev;
      }
      if (maintainOrder || prev.length === 0 && next.length > 0 || prev.length > 0 && next.length === 0) {
        return next;
      }
      var oldValues = [];
      var newValues = [];
      var prevMap = /* @__PURE__ */ new Map();
      var nextMap = /* @__PURE__ */ new Map();
      for (var i = 0; i < next.length; i++) {
        var c = next[i];
        nextMap.set(c.getInstanceId(), c);
      }
      for (var i = 0; i < prev.length; i++) {
        var c = prev[i];
        prevMap.set(c.getInstanceId(), c);
        if (nextMap.has(c.getInstanceId())) {
          oldValues.push(c);
        }
      }
      for (var i = 0; i < next.length; i++) {
        var c = next[i];
        var instanceId = c.getInstanceId();
        if (!prevMap.has(instanceId)) {
          newValues.push(c);
        }
      }
      if (oldValues.length === prev.length && newValues.length === 0) {
        return prev;
      }
      if (oldValues.length === 0 && newValues.length === next.length) {
        return next;
      }
      return __spreadArray(__spreadArray([], oldValues), newValues);
    }
    exports.getNextValueIfDifferent = getNextValueIfDifferent;
  }
});

// node_modules/ag-grid-react/lib/reactUi/cellRenderer/groupCellRenderer.js
var require_groupCellRenderer = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/cellRenderer/groupCellRenderer.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var react_1 = __importStar(require_react());
    var beansContext_1 = require_beansContext();
    var jsComp_1 = require_jsComp();
    var utils_1 = require_utils();
    var GroupCellRenderer = react_1.forwardRef(function(props, ref) {
      var context = react_1.useContext(beansContext_1.BeansContext).context;
      var eGui = react_1.useRef(null);
      var eValueRef = react_1.useRef(null);
      var eCheckboxRef = react_1.useRef(null);
      var eExpandedRef = react_1.useRef(null);
      var eContractedRef = react_1.useRef(null);
      var ctrlRef = react_1.useRef();
      var _a = react_1.useState(), innerCompDetails = _a[0], setInnerCompDetails = _a[1];
      var _b = react_1.useState(), childCount = _b[0], setChildCount = _b[1];
      var _c = react_1.useState(), value = _c[0], setValue = _c[1];
      var _d = react_1.useState(function() {
        return new utils_1.CssClasses();
      }), cssClasses = _d[0], setCssClasses = _d[1];
      var _e = react_1.useState(function() {
        return new utils_1.CssClasses("ag-hidden");
      }), expandedCssClasses = _e[0], setExpandedCssClasses = _e[1];
      var _f = react_1.useState(function() {
        return new utils_1.CssClasses("ag-hidden");
      }), contractedCssClasses = _f[0], setContractedCssClasses = _f[1];
      var _g = react_1.useState(function() {
        return new utils_1.CssClasses("ag-invisible");
      }), checkboxCssClasses = _g[0], setCheckboxCssClasses = _g[1];
      react_1.useImperativeHandle(ref, function() {
        return {
          // force new instance when grid tries to refresh
          refresh: function() {
            return false;
          }
        };
      });
      react_1.useLayoutEffect(function() {
        return jsComp_1.showJsComp(innerCompDetails, context, eValueRef.current);
      }, [innerCompDetails]);
      var setRef = react_1.useCallback(function(ref2) {
        eGui.current = ref2;
        if (!eGui.current) {
          context.destroyBean(ctrlRef.current);
          ctrlRef.current = null;
          return;
        }
        var compProxy = {
          setInnerRenderer: function(details, valueToDisplay) {
            setInnerCompDetails(details);
            setValue(valueToDisplay);
          },
          setChildCount: function(count) {
            return setChildCount(count);
          },
          addOrRemoveCssClass: function(name, on) {
            return setCssClasses(function(prev) {
              return prev.setClass(name, on);
            });
          },
          setContractedDisplayed: function(displayed) {
            return setContractedCssClasses(function(prev) {
              return prev.setClass("ag-hidden", !displayed);
            });
          },
          setExpandedDisplayed: function(displayed) {
            return setExpandedCssClasses(function(prev) {
              return prev.setClass("ag-hidden", !displayed);
            });
          },
          setCheckboxVisible: function(visible) {
            return setCheckboxCssClasses(function(prev) {
              return prev.setClass("ag-invisible", !visible);
            });
          }
        };
        ctrlRef.current = context.createBean(new ag_grid_community_1.GroupCellRendererCtrl());
        ctrlRef.current.init(compProxy, eGui.current, eCheckboxRef.current, eExpandedRef.current, eContractedRef.current, GroupCellRenderer, props);
      }, []);
      var className = react_1.useMemo(function() {
        return "ag-cell-wrapper " + cssClasses.toString();
      }, [cssClasses]);
      var expandedClassName = react_1.useMemo(function() {
        return "ag-group-expanded " + expandedCssClasses.toString();
      }, [expandedCssClasses]);
      var contractedClassName = react_1.useMemo(function() {
        return "ag-group-contracted " + contractedCssClasses.toString();
      }, [contractedCssClasses]);
      var checkboxClassName = react_1.useMemo(function() {
        return "ag-group-checkbox " + checkboxCssClasses.toString();
      }, [checkboxCssClasses]);
      var useFwRenderer = innerCompDetails && innerCompDetails.componentFromFramework;
      var FwRenderer = useFwRenderer ? innerCompDetails.componentClass : void 0;
      var useValue = innerCompDetails == null && value != null;
      var escapedValue = ag_grid_community_1._.escapeString(value, true);
      return react_1.default.createElement(
        "span",
        __assign({ className, ref: setRef }, !props.colDef ? { role: "gridcell" } : {}),
        react_1.default.createElement("span", { className: expandedClassName, ref: eExpandedRef }),
        react_1.default.createElement("span", { className: contractedClassName, ref: eContractedRef }),
        react_1.default.createElement("span", { className: checkboxClassName, ref: eCheckboxRef }),
        react_1.default.createElement(
          "span",
          { className: "ag-group-value", ref: eValueRef },
          useValue && react_1.default.createElement(react_1.default.Fragment, null, escapedValue),
          useFwRenderer && react_1.default.createElement(FwRenderer, __assign({}, innerCompDetails.params))
        ),
        react_1.default.createElement("span", { className: "ag-group-child-count" }, childCount)
      );
    });
    exports.default = GroupCellRenderer;
  }
});

// node_modules/ag-grid-react/lib/reactUi/header/headerCellComp.js
var require_headerCellComp = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/header/headerCellComp.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var react_1 = __importStar(require_react());
    var beansContext_1 = require_beansContext();
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var utils_1 = require_utils();
    var jsComp_1 = require_jsComp();
    var HeaderCellComp = function(props) {
      var ctrl = props.ctrl;
      var context = react_1.useContext(beansContext_1.BeansContext).context;
      var colId = ctrl.getColId();
      var _a = react_1.useState(), userCompDetails = _a[0], setUserCompDetails = _a[1];
      var eGui = react_1.useRef(null);
      var eResize = react_1.useRef(null);
      var eHeaderCompWrapper = react_1.useRef(null);
      var userCompRef = react_1.useRef();
      var cssClassManager = react_1.useRef();
      if (!cssClassManager.current) {
        cssClassManager.current = new ag_grid_community_1.CssClassManager(function() {
          return eGui.current;
        });
      }
      var setRef = react_1.useCallback(function(e) {
        var _a2;
        eGui.current = e;
        if (!eGui.current) {
          return;
        }
        var compProxy = {
          setWidth: function(width) {
            if (eGui.current) {
              eGui.current.style.width = width;
            }
          },
          addOrRemoveCssClass: function(name, on) {
            return cssClassManager.current.addOrRemoveCssClass(name, on);
          },
          setAriaDescription: function(label) {
            if (eGui.current) {
              ag_grid_community_1._.setAriaDescription(eGui.current, label);
            }
          },
          setAriaSort: function(sort) {
            if (eGui.current) {
              sort ? ag_grid_community_1._.setAriaSort(eGui.current, sort) : ag_grid_community_1._.removeAriaSort(eGui.current);
            }
          },
          setUserCompDetails: function(compDetails) {
            return setUserCompDetails(compDetails);
          },
          getUserCompInstance: function() {
            return userCompRef.current || void 0;
          }
        };
        ctrl.setComp(compProxy, eGui.current, eResize.current, eHeaderCompWrapper.current);
        var selectAllGui = ctrl.getSelectAllGui();
        (_a2 = eResize.current) === null || _a2 === void 0 ? void 0 : _a2.insertAdjacentElement("afterend", selectAllGui);
      }, []);
      react_1.useLayoutEffect(function() {
        return jsComp_1.showJsComp(userCompDetails, context, eHeaderCompWrapper.current, userCompRef);
      }, [userCompDetails]);
      react_1.useEffect(function() {
        ctrl.setDragSource(eGui.current);
      }, [userCompDetails]);
      var userCompStateless = react_1.useMemo(function() {
        var res = (userCompDetails === null || userCompDetails === void 0 ? void 0 : userCompDetails.componentFromFramework) && utils_1.isComponentStateless(userCompDetails.componentClass);
        return !!res;
      }, [userCompDetails]);
      var reactUserComp = userCompDetails && userCompDetails.componentFromFramework;
      var UserCompClass = userCompDetails && userCompDetails.componentClass;
      return react_1.default.createElement(
        "div",
        { ref: setRef, className: "ag-header-cell", "col-id": colId, role: "columnheader", tabIndex: -1 },
        react_1.default.createElement("div", { ref: eResize, className: "ag-header-cell-resize", role: "presentation" }),
        react_1.default.createElement(
          "div",
          { ref: eHeaderCompWrapper, className: "ag-header-cell-comp-wrapper", role: "presentation" },
          reactUserComp && userCompStateless && react_1.default.createElement(UserCompClass, __assign({}, userCompDetails.params)),
          reactUserComp && !userCompStateless && react_1.default.createElement(UserCompClass, __assign({}, userCompDetails.params, { ref: userCompRef }))
        )
      );
    };
    exports.default = react_1.memo(HeaderCellComp);
  }
});

// node_modules/ag-grid-react/lib/reactUi/header/headerGroupCellComp.js
var require_headerGroupCellComp = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/header/headerGroupCellComp.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var react_1 = __importStar(require_react());
    var beansContext_1 = require_beansContext();
    var jsComp_1 = require_jsComp();
    var utils_1 = require_utils();
    var HeaderGroupCellComp = function(props) {
      var context = react_1.useContext(beansContext_1.BeansContext).context;
      var ctrl = props.ctrl;
      var _a = react_1.useState(function() {
        return new utils_1.CssClasses();
      }), cssClasses = _a[0], setCssClasses = _a[1];
      var _b = react_1.useState(function() {
        return new utils_1.CssClasses();
      }), cssResizableClasses = _b[0], setResizableCssClasses = _b[1];
      var _c = react_1.useState("false"), resizableAriaHidden = _c[0], setResizableAriaHidden = _c[1];
      var _d = react_1.useState(), ariaExpanded = _d[0], setAriaExpanded = _d[1];
      var _e = react_1.useState(), userCompDetails = _e[0], setUserCompDetails = _e[1];
      var colId = react_1.useMemo(function() {
        return ctrl.getColId();
      }, []);
      var eGui = react_1.useRef(null);
      var eResize = react_1.useRef(null);
      var setRef = react_1.useCallback(function(e) {
        eGui.current = e;
        if (!eGui.current) {
          return;
        }
        var compProxy = {
          setWidth: function(width) {
            if (eGui.current) {
              eGui.current.style.width = width;
            }
          },
          addOrRemoveCssClass: function(name, on) {
            return setCssClasses(function(prev) {
              return prev.setClass(name, on);
            });
          },
          setUserCompDetails: function(compDetails) {
            return setUserCompDetails(compDetails);
          },
          setResizableDisplayed: function(displayed) {
            setResizableCssClasses(function(prev) {
              return prev.setClass("ag-hidden", !displayed);
            });
            setResizableAriaHidden(!displayed ? "true" : "false");
          },
          setAriaExpanded: function(expanded) {
            return setAriaExpanded(expanded);
          }
        };
        ctrl.setComp(compProxy, eGui.current, eResize.current);
      }, []);
      react_1.useLayoutEffect(function() {
        return jsComp_1.showJsComp(userCompDetails, context, eGui.current);
      }, [userCompDetails]);
      react_1.useEffect(function() {
        if (eGui.current) {
          ctrl.setDragSource(eGui.current);
        }
      }, [userCompDetails]);
      var className = react_1.useMemo(function() {
        return "ag-header-group-cell " + cssClasses.toString();
      }, [cssClasses]);
      var resizableClassName = react_1.useMemo(function() {
        return "ag-header-cell-resize " + cssResizableClasses.toString();
      }, [cssResizableClasses]);
      var reactUserComp = userCompDetails && userCompDetails.componentFromFramework;
      var UserCompClass = userCompDetails && userCompDetails.componentClass;
      return react_1.default.createElement(
        "div",
        { ref: setRef, className, "col-id": colId, role: "columnheader", tabIndex: -1, "aria-expanded": ariaExpanded },
        reactUserComp && react_1.default.createElement(UserCompClass, __assign({}, userCompDetails.params)),
        react_1.default.createElement("div", { ref: eResize, "aria-hidden": resizableAriaHidden, className: resizableClassName })
      );
    };
    exports.default = react_1.memo(HeaderGroupCellComp);
  }
});

// node_modules/ag-grid-react/lib/reactUi/header/headerFilterCellComp.js
var require_headerFilterCellComp = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/header/headerFilterCellComp.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var react_1 = __importStar(require_react());
    var beansContext_1 = require_beansContext();
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var utils_1 = require_utils();
    var jsComp_1 = require_jsComp();
    var HeaderFilterCellComp = function(props) {
      var context = react_1.useContext(beansContext_1.BeansContext).context;
      var _a = react_1.useState(function() {
        return new utils_1.CssClasses("ag-header-cell", "ag-floating-filter");
      }), cssClasses = _a[0], setCssClasses = _a[1];
      var _b = react_1.useState(function() {
        return new utils_1.CssClasses();
      }), cssBodyClasses = _b[0], setBodyCssClasses = _b[1];
      var _c = react_1.useState(function() {
        return new utils_1.CssClasses("ag-floating-filter-button", "ag-hidden");
      }), cssButtonWrapperClasses = _c[0], setButtonWrapperCssClasses = _c[1];
      var _d = react_1.useState("false"), buttonWrapperAriaHidden = _d[0], setButtonWrapperAriaHidden = _d[1];
      var _e = react_1.useState(), userCompDetails = _e[0], setUserCompDetails = _e[1];
      var eGui = react_1.useRef(null);
      var eFloatingFilterBody = react_1.useRef(null);
      var eButtonWrapper = react_1.useRef(null);
      var eButtonShowMainFilter = react_1.useRef(null);
      var userCompResolve = react_1.useRef();
      var userCompPromise = react_1.useRef();
      var userCompRef = function(value) {
        if (value == null) {
          return;
        }
        userCompResolve.current && userCompResolve.current(value);
      };
      var ctrl = props.ctrl;
      var setRef = react_1.useCallback(function(e) {
        eGui.current = e;
        if (!eGui.current) {
          return;
        }
        userCompPromise.current = new ag_grid_community_1.AgPromise(function(resolve) {
          userCompResolve.current = resolve;
        });
        var compProxy = {
          addOrRemoveCssClass: function(name, on) {
            return setCssClasses(function(prev) {
              return prev.setClass(name, on);
            });
          },
          addOrRemoveBodyCssClass: function(name, on) {
            return setBodyCssClasses(function(prev) {
              return prev.setClass(name, on);
            });
          },
          setButtonWrapperDisplayed: function(displayed) {
            setButtonWrapperCssClasses(function(prev) {
              return prev.setClass("ag-hidden", !displayed);
            });
            setButtonWrapperAriaHidden(!displayed ? "true" : "false");
          },
          setWidth: function(width) {
            if (eGui.current) {
              eGui.current.style.width = width;
            }
          },
          setCompDetails: function(compDetails) {
            return setUserCompDetails(compDetails);
          },
          getFloatingFilterComp: function() {
            return userCompPromise.current ? userCompPromise.current : null;
          },
          setMenuIcon: function(eIcon) {
            var _a2;
            return (_a2 = eButtonShowMainFilter.current) === null || _a2 === void 0 ? void 0 : _a2.appendChild(eIcon);
          }
        };
        ctrl.setComp(compProxy, eGui.current, eButtonShowMainFilter.current, eFloatingFilterBody.current);
      }, []);
      react_1.useLayoutEffect(function() {
        return jsComp_1.showJsComp(userCompDetails, context, eFloatingFilterBody.current, userCompRef);
      }, [userCompDetails]);
      var className = react_1.useMemo(function() {
        return cssClasses.toString();
      }, [cssClasses]);
      var bodyClassName = react_1.useMemo(function() {
        return cssBodyClasses.toString();
      }, [cssBodyClasses]);
      var buttonWrapperClassName = react_1.useMemo(function() {
        return cssButtonWrapperClasses.toString();
      }, [cssButtonWrapperClasses]);
      var userCompStateless = react_1.useMemo(function() {
        var res = userCompDetails && userCompDetails.componentFromFramework && utils_1.isComponentStateless(userCompDetails.componentClass);
        return !!res;
      }, [userCompDetails]);
      var reactUserComp = userCompDetails && userCompDetails.componentFromFramework;
      var UserCompClass = userCompDetails && userCompDetails.componentClass;
      return react_1.default.createElement(
        "div",
        { ref: setRef, className, role: "gridcell", tabIndex: -1 },
        react_1.default.createElement(
          "div",
          { ref: eFloatingFilterBody, className: bodyClassName, role: "presentation" },
          reactUserComp && userCompStateless && react_1.default.createElement(UserCompClass, __assign({}, userCompDetails.params)),
          reactUserComp && !userCompStateless && react_1.default.createElement(UserCompClass, __assign({}, userCompDetails.params, { ref: userCompRef }))
        ),
        react_1.default.createElement(
          "div",
          { ref: eButtonWrapper, "aria-hidden": buttonWrapperAriaHidden, className: buttonWrapperClassName, role: "presentation" },
          react_1.default.createElement("button", { ref: eButtonShowMainFilter, type: "button", className: "ag-button ag-floating-filter-button-button", tabIndex: -1 })
        )
      );
    };
    exports.default = react_1.memo(HeaderFilterCellComp);
  }
});

// node_modules/ag-grid-react/lib/reactUi/header/headerRowComp.js
var require_headerRowComp = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/header/headerRowComp.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var react_1 = __importStar(require_react());
    var headerCellComp_1 = __importDefault(require_headerCellComp());
    var headerGroupCellComp_1 = __importDefault(require_headerGroupCellComp());
    var headerFilterCellComp_1 = __importDefault(require_headerFilterCellComp());
    var utils_1 = require_utils();
    var HeaderRowComp = function(props) {
      var ctrl = props.ctrl;
      var _a = react_1.useMemo(function() {
        return ctrl.getTopAndHeight();
      }, []), topOffset = _a.topOffset, rowHeight = _a.rowHeight;
      var ariaRowIndex = ctrl.getAriaRowIndex();
      var className = ctrl.getHeaderRowClass();
      var transform = react_1.useMemo(function() {
        return ctrl.getTransform();
      }, []);
      var _b = react_1.useState(function() {
        return rowHeight + "px";
      }), height = _b[0], setHeight = _b[1];
      var _c = react_1.useState(function() {
        return topOffset + "px";
      }), top = _c[0], setTop = _c[1];
      var _d = react_1.useState(function() {
        return ctrl.getHeaderCtrls();
      }), cellCtrls = _d[0], setCellCtrls = _d[1];
      var eGui = react_1.useRef(null);
      var setRef = react_1.useCallback(function(e) {
        eGui.current = e;
        if (!e) {
          return;
        }
        var compProxy = {
          setHeight: function(height2) {
            return setHeight(height2);
          },
          setTop: function(top2) {
            return setTop(top2);
          },
          setHeaderCtrls: function(ctrls, forceOrder, afterScroll) {
            utils_1.agFlushSync(afterScroll, function() {
              setCellCtrls(function(prev) {
                return utils_1.getNextValueIfDifferent(prev, ctrls, forceOrder);
              });
            });
          },
          setWidth: function(width) {
            if (eGui.current) {
              eGui.current.style.width = width;
            }
          }
        };
        ctrl.setComp(compProxy, false);
      }, []);
      var style = react_1.useMemo(function() {
        return {
          transform,
          height,
          top
        };
      }, [transform, height, top]);
      var createCellJsx = react_1.useCallback(function(cellCtrl) {
        switch (ctrl.getType()) {
          case ag_grid_community_1.HeaderRowType.COLUMN_GROUP:
            return react_1.default.createElement(headerGroupCellComp_1.default, { ctrl: cellCtrl, key: cellCtrl.getInstanceId() });
          case ag_grid_community_1.HeaderRowType.FLOATING_FILTER:
            return react_1.default.createElement(headerFilterCellComp_1.default, { ctrl: cellCtrl, key: cellCtrl.getInstanceId() });
          default:
            return react_1.default.createElement(headerCellComp_1.default, { ctrl: cellCtrl, key: cellCtrl.getInstanceId() });
        }
      }, []);
      return react_1.default.createElement("div", { ref: setRef, className, role: "row", style, "aria-rowindex": ariaRowIndex }, cellCtrls.map(createCellJsx));
    };
    exports.default = react_1.memo(HeaderRowComp);
  }
});

// node_modules/ag-grid-react/lib/reactUi/header/headerRowContainerComp.js
var require_headerRowContainerComp = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/header/headerRowContainerComp.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var react_1 = __importStar(require_react());
    var beansContext_1 = require_beansContext();
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var headerRowComp_1 = __importDefault(require_headerRowComp());
    var HeaderRowContainerComp = function(props) {
      var _a = react_1.useState(true), displayed = _a[0], setDisplayed = _a[1];
      var _b = react_1.useState([]), headerRowCtrls = _b[0], setHeaderRowCtrls = _b[1];
      var context = react_1.useContext(beansContext_1.BeansContext).context;
      var eGui = react_1.useRef(null);
      var eCenterContainer = react_1.useRef(null);
      var headerRowCtrlRef = react_1.useRef(null);
      var pinnedLeft = props.pinned === "left";
      var pinnedRight = props.pinned === "right";
      var centre = !pinnedLeft && !pinnedRight;
      var setRef = react_1.useCallback(function(e) {
        eGui.current = e;
        if (!eGui.current) {
          context.destroyBean(headerRowCtrlRef.current);
          headerRowCtrlRef.current = null;
          return;
        }
        var compProxy = {
          setDisplayed,
          setCtrls: function(ctrls) {
            return setHeaderRowCtrls(ctrls);
          },
          // centre only
          setCenterWidth: function(width) {
            if (eCenterContainer.current) {
              eCenterContainer.current.style.width = width;
            }
          },
          setViewportScrollLeft: function(left) {
            if (eGui.current) {
              eGui.current.scrollLeft = left;
            }
          },
          // pinned only
          setPinnedContainerWidth: function(width) {
            if (eGui.current) {
              eGui.current.style.width = width;
              eGui.current.style.minWidth = width;
              eGui.current.style.maxWidth = width;
            }
          }
        };
        headerRowCtrlRef.current = context.createBean(new ag_grid_community_1.HeaderRowContainerCtrl(props.pinned));
        headerRowCtrlRef.current.setComp(compProxy, eGui.current);
      }, []);
      var className = !displayed ? "ag-hidden" : "";
      var insertRowsJsx = function() {
        return headerRowCtrls.map(function(ctrl) {
          return react_1.default.createElement(headerRowComp_1.default, { ctrl, key: ctrl.getInstanceId() });
        });
      };
      return react_1.default.createElement(
        react_1.default.Fragment,
        null,
        pinnedLeft && react_1.default.createElement("div", { ref: setRef, className: "ag-pinned-left-header " + className, "aria-hidden": !displayed, role: "presentation" }, insertRowsJsx()),
        pinnedRight && react_1.default.createElement("div", { ref: setRef, className: "ag-pinned-right-header " + className, "aria-hidden": !displayed, role: "presentation" }, insertRowsJsx()),
        centre && react_1.default.createElement(
          "div",
          { ref: setRef, className: "ag-header-viewport " + className, role: "presentation" },
          react_1.default.createElement("div", { ref: eCenterContainer, className: "ag-header-container", role: "rowgroup" }, insertRowsJsx())
        )
      );
    };
    exports.default = react_1.memo(HeaderRowContainerComp);
  }
});

// node_modules/ag-grid-react/lib/reactUi/header/gridHeaderComp.js
var require_gridHeaderComp = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/header/gridHeaderComp.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var react_1 = __importStar(require_react());
    var beansContext_1 = require_beansContext();
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var utils_1 = require_utils();
    var headerRowContainerComp_1 = __importDefault(require_headerRowContainerComp());
    var GridHeaderComp = function() {
      var _a = react_1.useState(function() {
        return new utils_1.CssClasses();
      }), cssClasses = _a[0], setCssClasses = _a[1];
      var _b = react_1.useState(), height = _b[0], setHeight = _b[1];
      var context = react_1.useContext(beansContext_1.BeansContext).context;
      var eGui = react_1.useRef(null);
      var gridCtrlRef = react_1.useRef(null);
      var setRef = react_1.useCallback(function(e) {
        eGui.current = e;
        if (!e) {
          context.destroyBean(gridCtrlRef.current);
          gridCtrlRef.current = null;
          return;
        }
        var compProxy = {
          addOrRemoveCssClass: function(name, on) {
            return setCssClasses(function(prev) {
              return prev.setClass(name, on);
            });
          },
          setHeightAndMinHeight: function(height2) {
            return setHeight(height2);
          }
        };
        gridCtrlRef.current = context.createBean(new ag_grid_community_1.GridHeaderCtrl());
        gridCtrlRef.current.setComp(compProxy, eGui.current, eGui.current);
      }, []);
      var className = react_1.useMemo(function() {
        var res = cssClasses.toString();
        return "ag-header " + res;
      }, [cssClasses]);
      var style = react_1.useMemo(function() {
        return {
          height,
          minHeight: height
        };
      }, [height]);
      return react_1.default.createElement(
        "div",
        { ref: setRef, className, style, role: "presentation" },
        react_1.default.createElement(headerRowContainerComp_1.default, { pinned: "left" }),
        react_1.default.createElement(headerRowContainerComp_1.default, { pinned: null }),
        react_1.default.createElement(headerRowContainerComp_1.default, { pinned: "right" })
      );
    };
    exports.default = react_1.memo(GridHeaderComp);
  }
});

// node_modules/ag-grid-react/lib/reactUi/reactComment.js
var require_reactComment = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/reactComment.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var react_1 = require_react();
    var useReactCommentEffect = function(comment, eForCommentRef) {
      react_1.useEffect(function() {
        var eForComment = eForCommentRef.current;
        if (eForComment) {
          var eParent_1 = eForComment.parentElement;
          if (eParent_1) {
            var eComment_1 = document.createComment(comment);
            eParent_1.insertBefore(eComment_1, eForComment);
            return function() {
              eParent_1.removeChild(eComment_1);
            };
          }
        }
      }, [comment]);
    };
    exports.default = useReactCommentEffect;
  }
});

// node_modules/ag-grid-react/lib/reactUi/useEffectOnce.js
var require_useEffectOnce = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/useEffectOnce.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useEffectOnce = void 0;
    var react_1 = require_react();
    var useEffectOnce = function(effect) {
      var effectFn = react_1.useRef(effect);
      var destroyFn = react_1.useRef();
      var effectCalled = react_1.useRef(false);
      var rendered = react_1.useRef(false);
      var _a = react_1.useState(0), setVal = _a[1];
      if (effectCalled.current) {
        rendered.current = true;
      }
      react_1.useEffect(function() {
        if (!effectCalled.current) {
          destroyFn.current = effectFn.current();
          effectCalled.current = true;
        }
        setVal(function(val) {
          return val + 1;
        });
        return function() {
          if (!rendered.current) {
            return;
          }
          if (destroyFn.current) {
            destroyFn.current();
          }
        };
      }, []);
    };
    exports.useEffectOnce = useEffectOnce;
  }
});

// node_modules/ag-grid-react/lib/reactUi/cells/popupEditorComp.js
var require_popupEditorComp = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/cells/popupEditorComp.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var react_1 = __importStar(require_react());
    var react_dom_1 = require_react_dom();
    var beansContext_1 = require_beansContext();
    var useEffectOnce_1 = require_useEffectOnce();
    var PopupEditorComp = function(props) {
      var _a = react_1.useState(), popupEditorWrapper = _a[0], setPopupEditorWrapper = _a[1];
      var _b = react_1.useContext(beansContext_1.BeansContext), context = _b.context, popupService = _b.popupService, localeService = _b.localeService, gridOptionsService = _b.gridOptionsService;
      useEffectOnce_1.useEffectOnce(function() {
        var editDetails = props.editDetails, cellCtrl = props.cellCtrl, eParentCell = props.eParentCell;
        var compDetails = editDetails.compDetails;
        var useModelPopup = gridOptionsService.is("stopEditingWhenCellsLoseFocus");
        var wrapper = context.createBean(new ag_grid_community_1.PopupEditorWrapper(compDetails.params));
        var ePopupGui = wrapper.getGui();
        if (props.jsChildComp) {
          var eChildGui = props.jsChildComp.getGui();
          if (eChildGui) {
            ePopupGui.appendChild(eChildGui);
          }
        }
        var positionParams = {
          column: cellCtrl.getColumn(),
          rowNode: cellCtrl.getRowNode(),
          type: "popupCellEditor",
          eventSource: eParentCell,
          ePopup: ePopupGui,
          position: editDetails.popupPosition,
          keepWithinBounds: true
        };
        var positionCallback = popupService.positionPopupByComponent.bind(popupService, positionParams);
        var translate = localeService.getLocaleTextFunc();
        var addPopupRes = popupService.addPopup({
          modal: useModelPopup,
          eChild: ePopupGui,
          closeOnEsc: true,
          closedCallback: function() {
            cellCtrl.onPopupEditorClosed();
          },
          anchorToElement: eParentCell,
          positionCallback,
          ariaLabel: translate("ariaLabelCellEditor", "Cell Editor")
        });
        var hideEditorPopup = addPopupRes ? addPopupRes.hideFunc : void 0;
        setPopupEditorWrapper(wrapper);
        props.jsChildComp && props.jsChildComp.afterGuiAttached && props.jsChildComp.afterGuiAttached();
        return function() {
          if (hideEditorPopup != null) {
            hideEditorPopup();
          }
          context.destroyBean(wrapper);
        };
      });
      return react_1.default.createElement(react_1.default.Fragment, null, popupEditorWrapper && props.wrappedContent && react_dom_1.createPortal(props.wrappedContent, popupEditorWrapper.getGui()));
    };
    exports.default = react_1.memo(PopupEditorComp);
  }
});

// node_modules/ag-grid-react/lib/reactUi/cells/showJsRenderer.js
var require_showJsRenderer = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/cells/showJsRenderer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var react_1 = require_react();
    var beansContext_1 = require_beansContext();
    var useJsCellRenderer = function(showDetails, showTools, eCellValue, cellValueVersion, jsCellRendererRef, eGui) {
      var context = react_1.useContext(beansContext_1.BeansContext).context;
      var destroyCellRenderer = react_1.useCallback(function() {
        var comp = jsCellRendererRef.current;
        if (!comp) {
          return;
        }
        var compGui = comp.getGui();
        if (compGui && compGui.parentElement) {
          compGui.parentElement.removeChild(compGui);
        }
        context.destroyBean(comp);
        jsCellRendererRef.current = void 0;
      }, []);
      react_1.useEffect(function() {
        var showValue = showDetails != null;
        var jsCompDetails = showDetails && showDetails.compDetails && !showDetails.compDetails.componentFromFramework;
        var waitingForToolsSetup = showTools && eCellValue == null;
        var showComp = showValue && jsCompDetails && !waitingForToolsSetup;
        if (!showComp) {
          destroyCellRenderer();
          return;
        }
        var compDetails = showDetails.compDetails;
        if (jsCellRendererRef.current) {
          var comp_1 = jsCellRendererRef.current;
          var attemptRefresh = comp_1.refresh != null && showDetails.force == false;
          var refreshResult = attemptRefresh ? comp_1.refresh(compDetails.params) : false;
          var refreshWorked = refreshResult === true || refreshResult === void 0;
          if (refreshWorked) {
            return;
          }
          destroyCellRenderer();
        }
        var promise = compDetails.newAgStackInstance();
        ;
        if (!promise) {
          return;
        }
        var comp = promise.resolveNow(null, function(x) {
          return x;
        });
        if (!comp) {
          return;
        }
        var compGui = comp.getGui();
        if (!compGui) {
          return;
        }
        var parent = showTools ? eCellValue : eGui.current;
        parent.appendChild(compGui);
        jsCellRendererRef.current = comp;
      }, [showDetails, showTools, cellValueVersion]);
      react_1.useEffect(function() {
        return destroyCellRenderer;
      }, []);
    };
    exports.default = useJsCellRenderer;
  }
});

// node_modules/ag-grid-react/lib/reactUi/cells/cellComp.js
var require_cellComp = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/cells/cellComp.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CellCompState = void 0;
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var react_1 = __importStar(require_react());
    var utils_1 = require_utils();
    var popupEditorComp_1 = __importDefault(require_popupEditorComp());
    var showJsRenderer_1 = __importDefault(require_showJsRenderer());
    var beansContext_1 = require_beansContext();
    var jsComp_1 = require_jsComp();
    var CellCompState;
    (function(CellCompState2) {
      CellCompState2[CellCompState2["ShowValue"] = 0] = "ShowValue";
      CellCompState2[CellCompState2["EditValue"] = 1] = "EditValue";
    })(CellCompState = exports.CellCompState || (exports.CellCompState = {}));
    var checkCellEditorDeprecations = function(popup, cellEditor, cellCtrl) {
      var col = cellCtrl.getColumn();
      if (!popup && cellEditor.isPopup && cellEditor.isPopup()) {
        var msg_1 = "AG Grid: Found an issue in column " + col.getColId() + ". If using React, specify an editor is a popup using colDef.cellEditorPopup=true. AG Grid React cannot depend on the editor component specifying if it's in a popup (via the isPopup() method on the editor), as React needs to know this information BEFORE the component is created.";
        ag_grid_community_1._.doOnce(function() {
          return console.warn(msg_1);
        }, "jsEditorComp-isPopup-" + cellCtrl.getColumn().getColId());
      }
      if (popup && cellEditor.getPopupPosition && cellEditor.getPopupPosition() != null) {
        var msg_2 = "AG Grid: Found an issue in column " + col.getColId() + ". If using React, specify an editor popup position using colDef.cellEditorPopupPosition=true. AG Grid React cannot depend on the editor component specifying it's position (via the getPopupPosition() method on the editor), as React needs to know this information BEFORE the component is created.";
        ag_grid_community_1._.doOnce(function() {
          return console.warn(msg_2);
        }, "jsEditorComp-getPopupPosition-" + cellCtrl.getColumn().getColId());
      }
    };
    var jsxEditValue = function(editDetails, setInlineCellEditorRef, setPopupCellEditorRef, eGui, cellCtrl, jsEditorComp) {
      var compDetails = editDetails.compDetails;
      var CellEditorClass = compDetails.componentClass;
      var reactInlineEditor = compDetails.componentFromFramework && !editDetails.popup;
      var reactPopupEditor = compDetails.componentFromFramework && editDetails.popup;
      var jsPopupEditor = !compDetails.componentFromFramework && editDetails.popup;
      return react_1.default.createElement(
        react_1.default.Fragment,
        null,
        reactInlineEditor && react_1.default.createElement(CellEditorClass, __assign({}, editDetails.compDetails.params, { ref: setInlineCellEditorRef })),
        reactPopupEditor && react_1.default.createElement(popupEditorComp_1.default, { editDetails, cellCtrl, eParentCell: eGui, wrappedContent: react_1.default.createElement(CellEditorClass, __assign({}, editDetails.compDetails.params, { ref: setPopupCellEditorRef })) }),
        jsPopupEditor && jsEditorComp && react_1.default.createElement(popupEditorComp_1.default, { editDetails, cellCtrl, eParentCell: eGui, jsChildComp: jsEditorComp })
      );
    };
    var jsxShowValue = function(showDetails, key, parentId, cellRendererRef, showCellWrapper, reactCellRendererStateless, setECellValue) {
      var compDetails = showDetails.compDetails, value = showDetails.value;
      var noCellRenderer = !compDetails;
      var reactCellRenderer = compDetails && compDetails.componentFromFramework;
      var CellRendererClass = compDetails && compDetails.componentClass;
      var valueForNoCellRenderer = (value === null || value === void 0 ? void 0 : value.toString) ? value.toString() : value;
      var bodyJsxFunc = function() {
        return react_1.default.createElement(
          react_1.default.Fragment,
          null,
          noCellRenderer && react_1.default.createElement(react_1.default.Fragment, null, valueForNoCellRenderer),
          reactCellRenderer && !reactCellRendererStateless && react_1.default.createElement(CellRendererClass, __assign({}, compDetails.params, { key, ref: cellRendererRef })),
          reactCellRenderer && reactCellRendererStateless && react_1.default.createElement(CellRendererClass, __assign({}, compDetails.params, { key }))
        );
      };
      return react_1.default.createElement(react_1.default.Fragment, null, showCellWrapper ? react_1.default.createElement("span", { role: "presentation", id: "cell-" + parentId, className: "ag-cell-value", ref: setECellValue }, bodyJsxFunc()) : bodyJsxFunc());
    };
    var CellComp = function(props) {
      var context = react_1.useContext(beansContext_1.BeansContext).context;
      var cellCtrl = props.cellCtrl, printLayout = props.printLayout, editingRow = props.editingRow;
      var tabIndex = cellCtrl.getTabIndex();
      var colId = cellCtrl.getColumnIdSanitised();
      var cellInstanceId = cellCtrl.getInstanceId();
      var _a = react_1.useState(function() {
        return cellCtrl.getIsCellRenderer() ? void 0 : { compDetails: void 0, value: cellCtrl.getValueToDisplay(), force: false };
      }), renderDetails = _a[0], setRenderDetails = _a[1];
      var _b = react_1.useState(), editDetails = _b[0], setEditDetails = _b[1];
      var _c = react_1.useState(1), renderKey = _c[0], setRenderKey = _c[1];
      var _d = react_1.useState(), userStyles = _d[0], setUserStyles = _d[1];
      var _e = react_1.useState(false), includeSelection = _e[0], setIncludeSelection = _e[1];
      var _f = react_1.useState(false), includeRowDrag = _f[0], setIncludeRowDrag = _f[1];
      var _g = react_1.useState(false), includeDndSource = _g[0], setIncludeDndSource = _g[1];
      var _h = react_1.useState(), jsEditorComp = _h[0], setJsEditorComp = _h[1];
      var forceWrapper = react_1.useMemo(function() {
        return cellCtrl.isForceWrapper();
      }, [cellCtrl]);
      var eGui = react_1.useRef(null);
      var cellRendererRef = react_1.useRef(null);
      var jsCellRendererRef = react_1.useRef();
      var cellEditorRef = react_1.useRef();
      var eCellWrapper = react_1.useRef();
      var cellWrapperDestroyFuncs = react_1.useRef([]);
      var eCellValue = react_1.useRef();
      var _j = react_1.useState(0), cellValueVersion = _j[0], setCellValueVersion = _j[1];
      var setCellValueRef = react_1.useCallback(function(ref) {
        eCellValue.current = ref;
        setCellValueVersion(function(v) {
          return v + 1;
        });
      }, []);
      var showTools = renderDetails != null && (includeSelection || includeDndSource || includeRowDrag);
      var showCellWrapper = forceWrapper || showTools;
      var setCellEditorRef = react_1.useCallback(function(popup, cellEditor) {
        cellEditorRef.current = cellEditor;
        if (cellEditor) {
          checkCellEditorDeprecations(popup, cellEditor, cellCtrl);
          var editingCancelledByUserComp = cellEditor.isCancelBeforeStart && cellEditor.isCancelBeforeStart();
          if (editingCancelledByUserComp) {
            setTimeout(function() {
              cellCtrl.stopEditing(true);
              cellCtrl.focusCell(true);
            });
          }
        }
      }, [cellCtrl]);
      var setPopupCellEditorRef = react_1.useCallback(function(cellRenderer) {
        return setCellEditorRef(true, cellRenderer);
      }, [setCellEditorRef]);
      var setInlineCellEditorRef = react_1.useCallback(function(cellRenderer) {
        return setCellEditorRef(false, cellRenderer);
      }, [setCellEditorRef]);
      var cssClassManager = react_1.useRef();
      if (!cssClassManager.current) {
        cssClassManager.current = new ag_grid_community_1.CssClassManager(function() {
          return eGui.current;
        });
      }
      showJsRenderer_1.default(renderDetails, showCellWrapper, eCellValue.current, cellValueVersion, jsCellRendererRef, eGui);
      var lastRenderDetails = react_1.useRef();
      react_1.useLayoutEffect(function() {
        var oldDetails = lastRenderDetails.current;
        var newDetails = renderDetails;
        lastRenderDetails.current = renderDetails;
        if (oldDetails == null || oldDetails.compDetails == null || newDetails == null || newDetails.compDetails == null) {
          return;
        }
        var oldCompDetails = oldDetails.compDetails;
        var newCompDetails = newDetails.compDetails;
        if (oldCompDetails.componentClass != newCompDetails.componentClass) {
          return;
        }
        if (cellRendererRef.current == null || cellRendererRef.current.refresh == null) {
          return;
        }
        var result = cellRendererRef.current.refresh(newCompDetails.params);
        if (result != true) {
          setRenderKey(function(prev) {
            return prev + 1;
          });
        }
      }, [renderDetails]);
      react_1.useLayoutEffect(function() {
        var doingJsEditor = editDetails && !editDetails.compDetails.componentFromFramework;
        if (!doingJsEditor) {
          return;
        }
        var compDetails = editDetails.compDetails;
        var isPopup = editDetails.popup === true;
        var cellEditor = jsComp_1.createSyncJsComp(compDetails);
        if (!cellEditor) {
          return;
        }
        var compGui = cellEditor.getGui();
        setCellEditorRef(isPopup, cellEditor);
        if (!isPopup) {
          var parentEl = (forceWrapper ? eCellWrapper : eGui).current;
          parentEl === null || parentEl === void 0 ? void 0 : parentEl.appendChild(compGui);
          cellEditor.afterGuiAttached && cellEditor.afterGuiAttached();
        }
        setJsEditorComp(cellEditor);
        return function() {
          context.destroyBean(cellEditor);
          setCellEditorRef(isPopup, void 0);
          setJsEditorComp(void 0);
          if (compGui && compGui.parentElement) {
            compGui.parentElement.removeChild(compGui);
          }
        };
      }, [editDetails]);
      var setCellWrapperRef = react_1.useCallback(function(ref) {
        eCellWrapper.current = ref;
        if (!eCellWrapper.current) {
          cellWrapperDestroyFuncs.current.forEach(function(f) {
            return f();
          });
          cellWrapperDestroyFuncs.current = [];
          return;
        }
        var addComp = function(comp) {
          var _a2;
          if (comp) {
            var eGui_1 = comp.getGui();
            (_a2 = eCellWrapper.current) === null || _a2 === void 0 ? void 0 : _a2.insertAdjacentElement("afterbegin", eGui_1);
            cellWrapperDestroyFuncs.current.push(function() {
              context.destroyBean(comp);
              ag_grid_community_1._.removeFromParent(eGui_1);
            });
          }
          return comp;
        };
        if (includeSelection) {
          var checkboxSelectionComp = cellCtrl.createSelectionCheckbox();
          addComp(checkboxSelectionComp);
        }
        if (includeDndSource) {
          addComp(cellCtrl.createDndSource());
        }
        if (includeRowDrag) {
          addComp(cellCtrl.createRowDragComp());
        }
      }, [cellCtrl, context, includeDndSource, includeRowDrag, includeSelection]);
      var setRef = react_1.useCallback(function(ref) {
        eGui.current = ref;
        if (!eGui.current) {
          return;
        }
        if (!cellCtrl) {
          return;
        }
        var compProxy = {
          addOrRemoveCssClass: function(name, on) {
            return cssClassManager.current.addOrRemoveCssClass(name, on);
          },
          setUserStyles: function(styles) {
            return setUserStyles(styles);
          },
          getFocusableElement: function() {
            return eGui.current;
          },
          setIncludeSelection: function(include) {
            return setIncludeSelection(include);
          },
          setIncludeRowDrag: function(include) {
            return setIncludeRowDrag(include);
          },
          setIncludeDndSource: function(include) {
            return setIncludeDndSource(include);
          },
          getCellEditor: function() {
            return cellEditorRef.current || null;
          },
          getCellRenderer: function() {
            return cellRendererRef.current ? cellRendererRef.current : jsCellRendererRef.current;
          },
          getParentOfValue: function() {
            return eCellValue.current ? eCellValue.current : eCellWrapper.current ? eCellWrapper.current : eGui.current;
          },
          setRenderDetails: function(compDetails, value, force) {
            setRenderDetails(function(prev) {
              if ((prev === null || prev === void 0 ? void 0 : prev.compDetails) !== compDetails || (prev === null || prev === void 0 ? void 0 : prev.value) !== value || (prev === null || prev === void 0 ? void 0 : prev.force) !== force) {
                return {
                  value,
                  compDetails,
                  force
                };
              } else {
                return prev;
              }
            });
          },
          setEditDetails: function(compDetails, popup, popupPosition) {
            if (compDetails) {
              setEditDetails({
                compDetails,
                popup,
                popupPosition
              });
              if (!popup) {
                setRenderDetails(void 0);
              }
            } else {
              setEditDetails(void 0);
            }
          }
        };
        var cellWrapperOrUndefined = eCellWrapper.current || void 0;
        cellCtrl.setComp(compProxy, eGui.current, cellWrapperOrUndefined, printLayout, editingRow);
      }, []);
      var reactCellRendererStateless = react_1.useMemo(function() {
        var res = renderDetails && renderDetails.compDetails && renderDetails.compDetails.componentFromFramework && utils_1.isComponentStateless(renderDetails.compDetails.componentClass);
        return !!res;
      }, [renderDetails]);
      react_1.useLayoutEffect(function() {
        var _a2;
        if (!eGui.current) {
          return;
        }
        cssClassManager.current.addOrRemoveCssClass("ag-cell-value", !showCellWrapper);
        cssClassManager.current.addOrRemoveCssClass("ag-cell-inline-editing", !!editDetails && !editDetails.popup);
        cssClassManager.current.addOrRemoveCssClass("ag-cell-popup-editing", !!editDetails && !!editDetails.popup);
        cssClassManager.current.addOrRemoveCssClass("ag-cell-not-inline-editing", !editDetails || !!editDetails.popup);
        (_a2 = cellCtrl.getRowCtrl()) === null || _a2 === void 0 ? void 0 : _a2.setInlineEditingCss(!!editDetails);
        if (cellCtrl.shouldRestoreFocus() && !cellCtrl.isEditing()) {
          eGui.current.focus({ preventScroll: true });
        }
      });
      var showContents = function() {
        return react_1.default.createElement(
          react_1.default.Fragment,
          null,
          renderDetails != null && jsxShowValue(renderDetails, renderKey, cellInstanceId, cellRendererRef, showCellWrapper, reactCellRendererStateless, setCellValueRef),
          editDetails != null && jsxEditValue(editDetails, setInlineCellEditorRef, setPopupCellEditorRef, eGui.current, cellCtrl, jsEditorComp)
        );
      };
      return react_1.default.createElement("div", { ref: setRef, style: userStyles, tabIndex, role: "gridcell", "col-id": colId }, showCellWrapper ? react_1.default.createElement("div", { className: "ag-cell-wrapper", role: "presentation", ref: setCellWrapperRef }, showContents()) : showContents());
    };
    exports.default = react_1.memo(CellComp);
  }
});

// node_modules/ag-grid-react/lib/reactUi/rows/rowComp.js
var require_rowComp = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/rows/rowComp.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var react_1 = __importStar(require_react());
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var jsComp_1 = require_jsComp();
    var utils_1 = require_utils();
    var beansContext_1 = require_beansContext();
    var cellComp_1 = __importDefault(require_cellComp());
    var RowComp = function(params) {
      var context = react_1.useContext(beansContext_1.BeansContext).context;
      var rowCtrl = params.rowCtrl, containerType = params.containerType;
      var tabIndex = rowCtrl.getTabIndex();
      var domOrderRef = react_1.useRef(rowCtrl.getDomOrder());
      var isFullWidth = rowCtrl.isFullWidth();
      var isDisplayed = rowCtrl.getRowNode().displayed;
      var _a = react_1.useState(function() {
        return isDisplayed ? rowCtrl.getRowIndex() : null;
      }), rowIndex = _a[0], setRowIndex = _a[1];
      var _b = react_1.useState(function() {
        return rowCtrl.getRowId();
      }), rowId = _b[0], setRowId = _b[1];
      var _c = react_1.useState(function() {
        return rowCtrl.getBusinessKey();
      }), rowBusinessKey = _c[0], setRowBusinessKey = _c[1];
      var _d = react_1.useState(function() {
        return rowCtrl.getRowStyles();
      }), userStyles = _d[0], setUserStyles = _d[1];
      var _e = react_1.useState(function() {
        return null;
      }), cellCtrls = _e[0], setCellCtrls = _e[1];
      var _f = react_1.useState(), fullWidthCompDetails = _f[0], setFullWidthCompDetails = _f[1];
      var _g = react_1.useState(function() {
        return isDisplayed ? rowCtrl.getInitialRowTop(containerType) : void 0;
      }), top = _g[0], setTop = _g[1];
      var _h = react_1.useState(function() {
        return isDisplayed ? rowCtrl.getInitialTransform(containerType) : void 0;
      }), transform = _h[0], setTransform = _h[1];
      var eGui = react_1.useRef(null);
      var fullWidthCompRef = react_1.useRef();
      var autoHeightSetup = react_1.useRef(false);
      var _j = react_1.useState(0), autoHeightSetupAttempt = _j[0], setAutoHeightSetupAttempt = _j[1];
      react_1.useEffect(function() {
        var _a2;
        if (autoHeightSetup.current) {
          return;
        }
        if (!fullWidthCompDetails) {
          return;
        }
        if (autoHeightSetupAttempt > 10) {
          return;
        }
        var eChild = (_a2 = eGui.current) === null || _a2 === void 0 ? void 0 : _a2.firstChild;
        if (eChild) {
          rowCtrl.setupDetailRowAutoHeight(eChild);
          autoHeightSetup.current = true;
        } else {
          setAutoHeightSetupAttempt(function(prev) {
            return prev + 1;
          });
        }
      }, [fullWidthCompDetails, autoHeightSetupAttempt]);
      var cssClassManager = react_1.useRef();
      if (!cssClassManager.current) {
        cssClassManager.current = new ag_grid_community_1.CssClassManager(function() {
          return eGui.current;
        });
      }
      var setRef = react_1.useCallback(function(e) {
        eGui.current = e;
        if (!eGui.current) {
          rowCtrl.unsetComp(containerType);
          return;
        }
        if (!rowCtrl.isAlive()) {
          return;
        }
        var compProxy = {
          // the rowTop is managed by state, instead of direct style manipulation by rowCtrl (like all the other styles)
          // as we need to have an initial value when it's placed into he DOM for the first time, for animation to work.
          setTop,
          setTransform,
          // i found using React for managing classes at the row level was to slow, as modifying classes caused a lot of
          // React code to execute, so avoiding React for managing CSS Classes made the grid go much faster.
          addOrRemoveCssClass: function(name, on) {
            return cssClassManager.current.addOrRemoveCssClass(name, on);
          },
          setDomOrder: function(domOrder) {
            return domOrderRef.current = domOrder;
          },
          setRowIndex,
          setRowId,
          setRowBusinessKey,
          setUserStyles,
          // if we don't maintain the order, then cols will be ripped out and into the dom
          // when cols reordered, which would stop the CSS transitions from working
          setCellCtrls: function(next, useFlushSync) {
            utils_1.agFlushSync(useFlushSync, function() {
              setCellCtrls(function(prev) {
                return utils_1.getNextValueIfDifferent(prev, next, domOrderRef.current);
              });
            });
          },
          showFullWidth: function(compDetails) {
            return setFullWidthCompDetails(compDetails);
          },
          getFullWidthCellRenderer: function() {
            return fullWidthCompRef.current;
          }
        };
        rowCtrl.setComp(compProxy, eGui.current, containerType);
      }, []);
      react_1.useLayoutEffect(function() {
        return jsComp_1.showJsComp(fullWidthCompDetails, context, eGui.current, fullWidthCompRef);
      }, [fullWidthCompDetails]);
      var rowStyles = react_1.useMemo(function() {
        var res = { top, transform };
        Object.assign(res, userStyles);
        return res;
      }, [top, transform, userStyles]);
      var showFullWidthFramework = isFullWidth && fullWidthCompDetails && fullWidthCompDetails.componentFromFramework;
      var showCells = !isFullWidth && cellCtrls != null;
      var reactFullWidthCellRendererStateless = react_1.useMemo(function() {
        var res = (fullWidthCompDetails === null || fullWidthCompDetails === void 0 ? void 0 : fullWidthCompDetails.componentFromFramework) && utils_1.isComponentStateless(fullWidthCompDetails.componentClass);
        return !!res;
      }, [fullWidthCompDetails]);
      var showCellsJsx = function() {
        return cellCtrls === null || cellCtrls === void 0 ? void 0 : cellCtrls.map(function(cellCtrl) {
          return react_1.default.createElement(cellComp_1.default, { cellCtrl, editingRow: rowCtrl.isEditing(), printLayout: rowCtrl.isPrintLayout(), key: cellCtrl.getInstanceId() });
        });
      };
      var showFullWidthFrameworkJsx = function() {
        var FullWidthComp = fullWidthCompDetails.componentClass;
        return react_1.default.createElement(
          react_1.default.Fragment,
          null,
          reactFullWidthCellRendererStateless && react_1.default.createElement(FullWidthComp, __assign({}, fullWidthCompDetails.params)),
          !reactFullWidthCellRendererStateless && react_1.default.createElement(FullWidthComp, __assign({}, fullWidthCompDetails.params, { ref: fullWidthCompRef }))
        );
      };
      return react_1.default.createElement(
        "div",
        { ref: setRef, role: "row", style: rowStyles, "row-index": rowIndex, "row-id": rowId, "row-business-key": rowBusinessKey, tabIndex },
        showCells && showCellsJsx(),
        showFullWidthFramework && showFullWidthFrameworkJsx()
      );
    };
    exports.default = react_1.memo(RowComp);
  }
});

// node_modules/ag-grid-react/lib/reactUi/rows/rowContainerComp.js
var require_rowContainerComp = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/rows/rowContainerComp.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var react_1 = __importStar(require_react());
    var utils_1 = require_utils();
    var reactComment_1 = __importDefault(require_reactComment());
    var rowComp_1 = __importDefault(require_rowComp());
    var beansContext_1 = require_beansContext();
    var RowContainerComp = function(params) {
      var context = react_1.useContext(beansContext_1.BeansContext).context;
      var name = params.name;
      var containerType = react_1.useMemo(function() {
        return ag_grid_community_1.getRowContainerTypeForName(name);
      }, [name]);
      var eViewport = react_1.useRef(null);
      var eContainer = react_1.useRef(null);
      var rowCtrlsRef = react_1.useRef([]);
      var _a = react_1.useState(function() {
        return [];
      }), rowCtrlsOrdered = _a[0], setRowCtrlsOrdered = _a[1];
      var domOrderRef = react_1.useRef(false);
      var rowContainerCtrlRef = react_1.useRef();
      var cssClasses = react_1.useMemo(function() {
        return ag_grid_community_1.RowContainerCtrl.getRowContainerCssClasses(name);
      }, [name]);
      var viewportClasses = react_1.useMemo(function() {
        return utils_1.classesList(cssClasses.viewport);
      }, [cssClasses]);
      var containerClasses = react_1.useMemo(function() {
        return utils_1.classesList(cssClasses.container);
      }, [cssClasses]);
      var centerTemplate = name === ag_grid_community_1.RowContainerName.CENTER || name === ag_grid_community_1.RowContainerName.TOP_CENTER || name === ag_grid_community_1.RowContainerName.BOTTOM_CENTER || name === ag_grid_community_1.RowContainerName.STICKY_TOP_CENTER;
      var topLevelRef = centerTemplate ? eViewport : eContainer;
      reactComment_1.default(" AG Row Container " + name + " ", topLevelRef);
      var areElementsReady = react_1.useCallback(function() {
        if (centerTemplate) {
          return eViewport.current != null && eContainer.current != null;
        }
        return eContainer.current != null;
      }, []);
      var areElementsRemoved = react_1.useCallback(function() {
        if (centerTemplate) {
          return eViewport.current == null && eContainer.current == null;
        }
        return eContainer.current == null;
      }, []);
      var setRef = react_1.useCallback(function() {
        if (areElementsRemoved()) {
          context.destroyBean(rowContainerCtrlRef.current);
          rowContainerCtrlRef.current = null;
        }
        if (areElementsReady()) {
          var updateRowCtrlsOrdered_1 = function(useFlushSync) {
            utils_1.agFlushSync(useFlushSync, function() {
              setRowCtrlsOrdered(function(prev) {
                return utils_1.getNextValueIfDifferent(prev, rowCtrlsRef.current, domOrderRef.current);
              });
            });
          };
          var compProxy = {
            setViewportHeight: function(height) {
              if (eViewport.current) {
                eViewport.current.style.height = height;
              }
            },
            setRowCtrls: function(rowCtrls, useFlushSync) {
              var useFlush = useFlushSync && rowCtrlsRef.current.length > 0 && rowCtrls.length > 0;
              rowCtrlsRef.current = rowCtrls;
              updateRowCtrlsOrdered_1(useFlush);
            },
            setDomOrder: function(domOrder) {
              if (domOrderRef.current != domOrder) {
                domOrderRef.current = domOrder;
                updateRowCtrlsOrdered_1(false);
              }
            },
            setContainerWidth: function(width) {
              if (eContainer.current) {
                eContainer.current.style.width = width;
              }
            }
          };
          rowContainerCtrlRef.current = context.createBean(new ag_grid_community_1.RowContainerCtrl(name));
          rowContainerCtrlRef.current.setComp(compProxy, eContainer.current, eViewport.current);
        }
      }, [areElementsReady, areElementsRemoved]);
      var setContainerRef = react_1.useCallback(function(e) {
        eContainer.current = e;
        setRef();
      }, [setRef]);
      var setViewportRef = react_1.useCallback(function(e) {
        eViewport.current = e;
        setRef();
      }, [setRef]);
      var buildContainer = function() {
        return react_1.default.createElement("div", { className: containerClasses, ref: setContainerRef, role: rowCtrlsOrdered.length ? "rowgroup" : "presentation" }, rowCtrlsOrdered.map(function(rowCtrl) {
          return react_1.default.createElement(rowComp_1.default, { rowCtrl, containerType, key: rowCtrl.getInstanceId() });
        }));
      };
      return react_1.default.createElement(react_1.default.Fragment, null, centerTemplate ? react_1.default.createElement("div", { className: viewportClasses, ref: setViewportRef, role: "presentation" }, buildContainer()) : buildContainer());
    };
    exports.default = react_1.memo(RowContainerComp);
  }
});

// node_modules/ag-grid-react/lib/reactUi/gridBodyComp.js
var require_gridBodyComp = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/gridBodyComp.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var react_1 = __importStar(require_react());
    var beansContext_1 = require_beansContext();
    var gridHeaderComp_1 = __importDefault(require_gridHeaderComp());
    var reactComment_1 = __importDefault(require_reactComment());
    var rowContainerComp_1 = __importDefault(require_rowContainerComp());
    var utils_1 = require_utils();
    var GridBodyComp = function() {
      var _a = react_1.useContext(beansContext_1.BeansContext), context = _a.context, agStackComponentsRegistry = _a.agStackComponentsRegistry, resizeObserverService = _a.resizeObserverService;
      var _b = react_1.useState(""), rowAnimationClass = _b[0], setRowAnimationClass = _b[1];
      var _c = react_1.useState(0), topHeight = _c[0], setTopHeight = _c[1];
      var _d = react_1.useState(0), bottomHeight = _d[0], setBottomHeight = _d[1];
      var _e = react_1.useState("0px"), stickyTopHeight = _e[0], setStickyTopHeight = _e[1];
      var _f = react_1.useState("0px"), stickyTopTop = _f[0], setStickyTopTop = _f[1];
      var _g = react_1.useState("100%"), stickyTopWidth = _g[0], setStickyTopWidth = _g[1];
      var _h = react_1.useState(""), topDisplay = _h[0], setTopDisplay = _h[1];
      var _j = react_1.useState(""), bottomDisplay = _j[0], setBottomDisplay = _j[1];
      var _k = react_1.useState(null), forceVerticalScrollClass = _k[0], setForceVerticalScrollClass = _k[1];
      var _l = react_1.useState(""), topAndBottomOverflowY = _l[0], setTopAndBottomOverflowY = _l[1];
      var _m = react_1.useState(null), cellSelectableCss = _m[0], setCellSelectableCss = _m[1];
      var _o = react_1.useState("ag-layout-normal"), layoutClass = _o[0], setLayoutClass = _o[1];
      var cssClassManager = react_1.useRef();
      if (!cssClassManager.current) {
        cssClassManager.current = new ag_grid_community_1.CssClassManager(function() {
          return eRoot.current;
        });
      }
      var eRoot = react_1.useRef(null);
      var eTop = react_1.useRef(null);
      var eStickyTop = react_1.useRef(null);
      var eBody = react_1.useRef(null);
      var eBodyViewport = react_1.useRef(null);
      var eBottom = react_1.useRef(null);
      var beansToDestroy = react_1.useRef([]);
      var destroyFuncs = react_1.useRef([]);
      reactComment_1.default(" AG Grid Body ", eRoot);
      reactComment_1.default(" AG Pinned Top ", eTop);
      reactComment_1.default(" AG Sticky Top ", eStickyTop);
      reactComment_1.default(" AG Middle ", eBodyViewport);
      reactComment_1.default(" AG Pinned Bottom ", eBottom);
      var setRef = react_1.useCallback(function(e) {
        eRoot.current = e;
        if (!eRoot.current) {
          context.destroyBeans(beansToDestroy.current);
          destroyFuncs.current.forEach(function(f) {
            return f();
          });
          beansToDestroy.current = [];
          destroyFuncs.current = [];
          return;
        }
        if (!context) {
          return;
        }
        var newComp = function(tag) {
          var CompClass = agStackComponentsRegistry.getComponentClass(tag);
          var comp = context.createBean(new CompClass());
          beansToDestroy.current.push(comp);
          return comp;
        };
        var attachToDom = function(eParent, eChild) {
          eParent.appendChild(eChild);
          destroyFuncs.current.push(function() {
            return eParent.removeChild(eChild);
          });
        };
        attachToDom(eRoot.current, document.createComment(" AG Fake Horizontal Scroll "));
        attachToDom(eRoot.current, newComp("AG-FAKE-HORIZONTAL-SCROLL").getGui());
        attachToDom(eRoot.current, document.createComment(" AG Overlay Wrapper "));
        attachToDom(eRoot.current, newComp("AG-OVERLAY-WRAPPER").getGui());
        if (eBody.current) {
          attachToDom(eBody.current, document.createComment(" AG Fake Vertical Scroll "));
          attachToDom(eBody.current, newComp("AG-FAKE-VERTICAL-SCROLL").getGui());
        }
        var compProxy = {
          setRowAnimationCssOnBodyViewport: setRowAnimationClass,
          setColumnCount: function(count) {
            if (eRoot.current) {
              ag_grid_community_1._.setAriaColCount(eRoot.current, count);
            }
          },
          setRowCount: function(count) {
            if (eRoot.current) {
              ag_grid_community_1._.setAriaRowCount(eRoot.current, count);
            }
          },
          setTopHeight,
          setBottomHeight,
          setStickyTopHeight,
          setStickyTopTop,
          setStickyTopWidth,
          setTopDisplay,
          setBottomDisplay,
          setColumnMovingCss: function(cssClass, flag) {
            return cssClassManager.current.addOrRemoveCssClass(cssClass, flag);
          },
          updateLayoutClasses: setLayoutClass,
          setAlwaysVerticalScrollClass: setForceVerticalScrollClass,
          setPinnedTopBottomOverflowY: setTopAndBottomOverflowY,
          setCellSelectableCss: function(cssClass, flag) {
            return setCellSelectableCss(flag ? cssClass : null);
          },
          setBodyViewportWidth: function(width) {
            if (eBodyViewport.current) {
              eBodyViewport.current.style.width = width;
            }
          },
          registerBodyViewportResizeListener: function(listener) {
            if (eBodyViewport.current) {
              var unsubscribeFromResize_1 = resizeObserverService.observeResize(eBodyViewport.current, listener);
              destroyFuncs.current.push(function() {
                return unsubscribeFromResize_1();
              });
            }
          }
        };
        var ctrl = context.createBean(new ag_grid_community_1.GridBodyCtrl());
        beansToDestroy.current.push(ctrl);
        ctrl.setComp(compProxy, eRoot.current, eBodyViewport.current, eTop.current, eBottom.current, eStickyTop.current);
      }, []);
      var rootClasses = react_1.useMemo(function() {
        return utils_1.classesList("ag-root", "ag-unselectable", layoutClass);
      }, [layoutClass]);
      var bodyViewportClasses = react_1.useMemo(function() {
        return utils_1.classesList("ag-body-viewport", rowAnimationClass, layoutClass, forceVerticalScrollClass, cellSelectableCss);
      }, [rowAnimationClass, layoutClass, forceVerticalScrollClass, cellSelectableCss]);
      var bodyClasses = react_1.useMemo(function() {
        return utils_1.classesList("ag-body", layoutClass);
      }, [layoutClass]);
      var topClasses = react_1.useMemo(function() {
        return utils_1.classesList("ag-floating-top", cellSelectableCss);
      }, [cellSelectableCss]);
      var stickyTopClasses = react_1.useMemo(function() {
        return utils_1.classesList("ag-sticky-top", cellSelectableCss);
      }, [cellSelectableCss]);
      var bottomClasses = react_1.useMemo(function() {
        return utils_1.classesList("ag-floating-bottom", cellSelectableCss);
      }, [cellSelectableCss]);
      var topStyle = react_1.useMemo(function() {
        return {
          height: topHeight,
          minHeight: topHeight,
          display: topDisplay,
          overflowY: topAndBottomOverflowY
        };
      }, [topHeight, topDisplay, topAndBottomOverflowY]);
      var stickyTopStyle = react_1.useMemo(function() {
        return {
          height: stickyTopHeight,
          top: stickyTopTop,
          width: stickyTopWidth
        };
      }, [stickyTopHeight, stickyTopTop, stickyTopWidth]);
      var bottomStyle = react_1.useMemo(function() {
        return {
          height: bottomHeight,
          minHeight: bottomHeight,
          display: bottomDisplay,
          overflowY: topAndBottomOverflowY
        };
      }, [bottomHeight, bottomDisplay, topAndBottomOverflowY]);
      var createRowContainer = function(container) {
        return react_1.default.createElement(rowContainerComp_1.default, { name: container, key: container + "-container" });
      };
      var createSection = function(_a2) {
        var section = _a2.section, children = _a2.children, className = _a2.className, style = _a2.style;
        return react_1.default.createElement("div", { ref: section, className, role: "presentation", style }, children.map(createRowContainer));
      };
      return react_1.default.createElement(
        "div",
        { ref: setRef, className: rootClasses, role: "treegrid" },
        react_1.default.createElement(gridHeaderComp_1.default, null),
        createSection({ section: eTop, className: topClasses, style: topStyle, children: [
          ag_grid_community_1.RowContainerName.TOP_LEFT,
          ag_grid_community_1.RowContainerName.TOP_CENTER,
          ag_grid_community_1.RowContainerName.TOP_RIGHT,
          ag_grid_community_1.RowContainerName.TOP_FULL_WIDTH
        ] }),
        react_1.default.createElement("div", { className: bodyClasses, ref: eBody, role: "presentation" }, createSection({
          section: eBodyViewport,
          className: bodyViewportClasses,
          children: [
            ag_grid_community_1.RowContainerName.LEFT,
            ag_grid_community_1.RowContainerName.CENTER,
            ag_grid_community_1.RowContainerName.RIGHT,
            ag_grid_community_1.RowContainerName.FULL_WIDTH
          ]
        })),
        createSection({ section: eStickyTop, className: stickyTopClasses, style: stickyTopStyle, children: [
          ag_grid_community_1.RowContainerName.STICKY_TOP_LEFT,
          ag_grid_community_1.RowContainerName.STICKY_TOP_CENTER,
          ag_grid_community_1.RowContainerName.STICKY_TOP_RIGHT,
          ag_grid_community_1.RowContainerName.STICKY_TOP_FULL_WIDTH
        ] }),
        createSection({ section: eBottom, className: bottomClasses, style: bottomStyle, children: [
          ag_grid_community_1.RowContainerName.BOTTOM_LEFT,
          ag_grid_community_1.RowContainerName.BOTTOM_CENTER,
          ag_grid_community_1.RowContainerName.BOTTOM_RIGHT,
          ag_grid_community_1.RowContainerName.BOTTOM_FULL_WIDTH
        ] })
      );
    };
    exports.default = react_1.memo(GridBodyComp);
  }
});

// node_modules/ag-grid-react/lib/reactUi/tabGuardComp.js
var require_tabGuardComp = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/tabGuardComp.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var react_1 = __importStar(require_react());
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var beansContext_1 = require_beansContext();
    var TabGuardCompRef = function(props, forwardRef) {
      var children = props.children, eFocusableElement = props.eFocusableElement, onTabKeyDown = props.onTabKeyDown, gridCtrl = props.gridCtrl;
      var context = react_1.useContext(beansContext_1.BeansContext).context;
      var topTabGuardRef = react_1.useRef(null);
      var bottomTabGuardRef = react_1.useRef(null);
      var tabGuardCtrlRef = react_1.useRef();
      var setTabIndex = function(value) {
        var processedValue = value == null ? void 0 : parseInt(value, 10).toString();
        [topTabGuardRef, bottomTabGuardRef].forEach(function(tabGuard) {
          var _a, _b;
          if (processedValue === void 0) {
            (_a = tabGuard.current) === null || _a === void 0 ? void 0 : _a.removeAttribute("tabindex");
          } else {
            (_b = tabGuard.current) === null || _b === void 0 ? void 0 : _b.setAttribute("tabindex", processedValue);
          }
        });
      };
      react_1.useImperativeHandle(forwardRef, function() {
        return {
          forceFocusOutOfContainer: function() {
            var _a;
            (_a = tabGuardCtrlRef.current) === null || _a === void 0 ? void 0 : _a.forceFocusOutOfContainer();
          }
        };
      });
      var setupCtrl = react_1.useCallback(function() {
        if (!topTabGuardRef.current && !bottomTabGuardRef.current) {
          context.destroyBean(tabGuardCtrlRef.current);
          tabGuardCtrlRef.current = null;
          return;
        }
        if (topTabGuardRef.current && bottomTabGuardRef.current) {
          var compProxy = {
            setTabIndex
          };
          tabGuardCtrlRef.current = context.createBean(new ag_grid_community_1.TabGuardCtrl({
            comp: compProxy,
            eTopGuard: topTabGuardRef.current,
            eBottomGuard: bottomTabGuardRef.current,
            eFocusableElement,
            onTabKeyDown,
            focusInnerElement: function(fromBottom) {
              return gridCtrl.focusInnerElement(fromBottom);
            }
          }));
        }
      }, []);
      var setTopRef = react_1.useCallback(function(e) {
        topTabGuardRef.current = e;
        setupCtrl();
      }, [setupCtrl]);
      var setBottomRef = react_1.useCallback(function(e) {
        bottomTabGuardRef.current = e;
        setupCtrl();
      }, [setupCtrl]);
      var createTabGuard = function(side) {
        var className = side === "top" ? ag_grid_community_1.TabGuardClassNames.TAB_GUARD_TOP : ag_grid_community_1.TabGuardClassNames.TAB_GUARD_BOTTOM;
        return react_1.default.createElement("div", { className: ag_grid_community_1.TabGuardClassNames.TAB_GUARD + " " + className, role: "presentation", ref: side === "top" ? setTopRef : setBottomRef });
      };
      return react_1.default.createElement(
        react_1.default.Fragment,
        null,
        createTabGuard("top"),
        children,
        createTabGuard("bottom")
      );
    };
    var TabGuardComp = react_1.forwardRef(TabGuardCompRef);
    exports.default = react_1.memo(TabGuardComp);
  }
});

// node_modules/ag-grid-react/lib/reactUi/gridComp.js
var require_gridComp = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/gridComp.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var react_1 = __importStar(require_react());
    var beansContext_1 = require_beansContext();
    var gridBodyComp_1 = __importDefault(require_gridBodyComp());
    var reactComment_1 = __importDefault(require_reactComment());
    var tabGuardComp_1 = __importDefault(require_tabGuardComp());
    var utils_1 = require_utils();
    var GridComp = function(_a) {
      var context = _a.context;
      var _b = react_1.useState(""), rtlClass = _b[0], setRtlClass = _b[1];
      var _c = react_1.useState(""), keyboardFocusClass = _c[0], setKeyboardFocusClass = _c[1];
      var _d = react_1.useState(""), layoutClass = _d[0], setLayoutClass = _d[1];
      var _e = react_1.useState(null), cursor = _e[0], setCursor = _e[1];
      var _f = react_1.useState(null), userSelect = _f[0], setUserSelect = _f[1];
      var _g = react_1.useState(false), initialised = _g[0], setInitialised = _g[1];
      var _h = react_1.useState(), tabGuardReady = _h[0], setTabGuardReady = _h[1];
      var gridCtrlRef = react_1.useRef(null);
      var eRootWrapperRef = react_1.useRef(null);
      var tabGuardRef = react_1.useRef();
      var _j = react_1.useState(null), eGridBodyParent = _j[0], setGridBodyParent = _j[1];
      var focusInnerElementRef = react_1.useRef(function() {
        return void 0;
      });
      var onTabKeyDown = react_1.useCallback(function() {
        return void 0;
      }, []);
      var beans = react_1.useMemo(function() {
        if (context.isDestroyed()) {
          return null;
        }
        return context.getBean("beans");
      }, [context]);
      reactComment_1.default(" AG Grid ", eRootWrapperRef);
      var setRef = react_1.useCallback(function(e) {
        eRootWrapperRef.current = e;
        if (!eRootWrapperRef.current) {
          context.destroyBean(gridCtrlRef.current);
          gridCtrlRef.current = null;
          return;
        }
        if (context.isDestroyed()) {
          return;
        }
        gridCtrlRef.current = context.createBean(new ag_grid_community_1.GridCtrl());
        var gridCtrl = gridCtrlRef.current;
        focusInnerElementRef.current = gridCtrl.focusInnerElement.bind(gridCtrl);
        var compProxy = {
          destroyGridUi: function() {
          },
          setRtlClass,
          addOrRemoveKeyboardFocusClass: function(addOrRemove) {
            return setKeyboardFocusClass(addOrRemove ? ag_grid_community_1.FocusService.AG_KEYBOARD_FOCUS : "");
          },
          forceFocusOutOfContainer: function() {
            var _a2;
            (_a2 = tabGuardRef.current) === null || _a2 === void 0 ? void 0 : _a2.forceFocusOutOfContainer();
          },
          updateLayoutClasses: setLayoutClass,
          getFocusableContainers: function() {
            var _a2, _b2;
            var els = [];
            var gridBodyCompEl = (_a2 = eRootWrapperRef.current) === null || _a2 === void 0 ? void 0 : _a2.querySelector(".ag-root");
            var sideBarEl = (_b2 = eRootWrapperRef.current) === null || _b2 === void 0 ? void 0 : _b2.querySelector(".ag-side-bar:not(.ag-hidden)");
            if (gridBodyCompEl) {
              els.push(gridBodyCompEl);
            }
            if (sideBarEl) {
              els.push(sideBarEl);
            }
            return els;
          },
          setCursor,
          setUserSelect
        };
        gridCtrl.setComp(compProxy, eRootWrapperRef.current, eRootWrapperRef.current);
        setInitialised(true);
      }, []);
      react_1.useEffect(function() {
        if (!tabGuardReady || !beans || !gridCtrlRef.current || !eGridBodyParent || !eRootWrapperRef.current) {
          return;
        }
        var gridCtrl = gridCtrlRef.current;
        var beansToDestroy = [];
        var agStackComponentsRegistry = beans.agStackComponentsRegistry;
        var HeaderDropZonesClass = agStackComponentsRegistry.getComponentClass("AG-GRID-HEADER-DROP-ZONES");
        var SideBarClass = agStackComponentsRegistry.getComponentClass("AG-SIDE-BAR");
        var StatusBarClass = agStackComponentsRegistry.getComponentClass("AG-STATUS-BAR");
        var WatermarkClass = agStackComponentsRegistry.getComponentClass("AG-WATERMARK");
        var PaginationClass = agStackComponentsRegistry.getComponentClass("AG-PAGINATION");
        var additionalEls = [];
        var eRootWrapper = eRootWrapperRef.current;
        if (gridCtrl.showDropZones() && HeaderDropZonesClass) {
          var headerDropZonesComp = context.createBean(new HeaderDropZonesClass());
          var eGui = headerDropZonesComp.getGui();
          eRootWrapper.insertAdjacentElement("afterbegin", eGui);
          additionalEls.push(eGui);
          beansToDestroy.push(headerDropZonesComp);
        }
        if (gridCtrl.showSideBar() && SideBarClass) {
          var sideBarComp = context.createBean(new SideBarClass());
          var eGui = sideBarComp.getGui();
          var bottomTabGuard = eGridBodyParent.querySelector(".ag-tab-guard-bottom");
          if (bottomTabGuard) {
            bottomTabGuard.insertAdjacentElement("beforebegin", eGui);
            additionalEls.push(eGui);
          }
          beansToDestroy.push(sideBarComp);
        }
        if (gridCtrl.showStatusBar() && StatusBarClass) {
          var statusBarComp = context.createBean(new StatusBarClass());
          var eGui = statusBarComp.getGui();
          eRootWrapper.insertAdjacentElement("beforeend", eGui);
          additionalEls.push(eGui);
          beansToDestroy.push(statusBarComp);
        }
        if (PaginationClass) {
          var paginationComp = context.createBean(new PaginationClass());
          var eGui = paginationComp.getGui();
          eRootWrapper.insertAdjacentElement("beforeend", eGui);
          additionalEls.push(eGui);
          beansToDestroy.push(paginationComp);
        }
        if (gridCtrl.showWatermark() && WatermarkClass) {
          var watermarkComp = context.createBean(new WatermarkClass());
          var eGui = watermarkComp.getGui();
          eRootWrapper.insertAdjacentElement("beforeend", eGui);
          additionalEls.push(eGui);
          beansToDestroy.push(watermarkComp);
        }
        return function() {
          context.destroyBeans(beansToDestroy);
          additionalEls.forEach(function(el) {
            if (el.parentElement) {
              el.parentElement.removeChild(el);
            }
          });
        };
      }, [tabGuardReady, eGridBodyParent, beans]);
      var rootWrapperClasses = react_1.useMemo(function() {
        return utils_1.classesList("ag-root-wrapper", rtlClass, keyboardFocusClass, layoutClass);
      }, [rtlClass, keyboardFocusClass, layoutClass]);
      var rootWrapperBodyClasses = react_1.useMemo(function() {
        return utils_1.classesList("ag-root-wrapper-body", "ag-focus-managed", layoutClass);
      }, [layoutClass]);
      var topStyle = react_1.useMemo(function() {
        return {
          userSelect: userSelect != null ? userSelect : "",
          WebkitUserSelect: userSelect != null ? userSelect : "",
          cursor: cursor != null ? cursor : ""
        };
      }, [userSelect, cursor]);
      var setTabGuardCompRef = react_1.useCallback(function(ref) {
        tabGuardRef.current = ref;
        setTabGuardReady(ref !== null);
      }, []);
      return react_1.default.createElement(
        "div",
        { ref: setRef, className: rootWrapperClasses, style: topStyle, role: "presentation" },
        react_1.default.createElement("div", { className: rootWrapperBodyClasses, ref: setGridBodyParent, role: "presentation" }, initialised && eGridBodyParent && beans && react_1.default.createElement(
          beansContext_1.BeansContext.Provider,
          { value: beans },
          react_1.default.createElement(
            tabGuardComp_1.default,
            { ref: setTabGuardCompRef, eFocusableElement: eGridBodyParent, onTabKeyDown, gridCtrl: gridCtrlRef.current },
            // we wait for initialised before rending the children, so GridComp has created and registered with it's
            // GridCtrl before we create the child GridBodyComp. Otherwise the GridBodyComp would initialise first,
            // before we have set the the Layout CSS classes, causing the GridBodyComp to render rows to a grid that
            // doesn't have it's height specified, which would result if all the rows getting rendered (and if many rows,
            // hangs the UI)
            react_1.default.createElement(gridBodyComp_1.default, null)
          )
        ))
      );
    };
    exports.default = react_1.memo(GridComp);
  }
});

// node_modules/ag-grid-react/lib/reactUi/agGridReactUi.js
var require_agGridReactUi = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/agGridReactUi.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AgGridReactUi = void 0;
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var react_1 = __importStar(require_react());
    var newReactComponent_1 = require_newReactComponent();
    var portalManager_1 = require_portalManager();
    var reactFrameworkOverrides_1 = require_reactFrameworkOverrides();
    var gridComp_1 = __importDefault(require_gridComp());
    function debug(msg, obj) {
    }
    var AgGridReactUi = function(props) {
      var _a, _b;
      var gridOptionsRef = react_1.useRef(null);
      var eGui = react_1.useRef(null);
      var portalManager = react_1.useRef(null);
      var destroyFuncs = react_1.useRef([]);
      var whenReadyFuncs = react_1.useRef([]);
      var prevProps = react_1.useRef(props);
      var ready = react_1.useRef(false);
      var _c = react_1.useState(void 0), context = _c[0], setContext = _c[1];
      var checkForDeprecations = react_1.useCallback(function(props2) {
        if (props2.rowDataChangeDetectionStrategy) {
          ag_grid_community_1._.doOnce(function() {
            return console.warn("AG Grid: Since v29 rowDataChangeDetectionStrategy has been deprecated. Row data property changes will be compared by reference via triple equals ===. See https://ag-grid.com/react-data-grid/react-hooks/");
          }, "rowDataChangeDetectionStrategy_Deprecation");
        }
      }, []);
      var _d = react_1.useState(0), setPortalRefresher = _d[1];
      var setRef = react_1.useCallback(function(e) {
        eGui.current = e;
        if (!eGui.current) {
          debug("AgGridReactUi.destroy");
          destroyFuncs.current.forEach(function(f) {
            return f();
          });
          destroyFuncs.current.length = 0;
          return;
        }
        var modules = props.modules || [];
        if (!portalManager.current) {
          portalManager.current = new portalManager_1.PortalManager(function() {
            return setPortalRefresher(function(prev) {
              return prev + 1;
            });
          }, props.componentWrappingElement, props.maxComponentCreationTimeMs);
          destroyFuncs.current.push(function() {
            var _a2;
            (_a2 = portalManager.current) === null || _a2 === void 0 ? void 0 : _a2.destroy();
            portalManager.current = null;
          });
        }
        var gridParams = {
          providedBeanInstances: {
            frameworkComponentWrapper: new ReactFrameworkComponentWrapper(portalManager.current)
          },
          modules,
          frameworkOverrides: new reactFrameworkOverrides_1.ReactFrameworkOverrides(true)
        };
        gridOptionsRef.current = props.gridOptions || {};
        gridOptionsRef.current = ag_grid_community_1.ComponentUtil.copyAttributesToGridOptions(gridOptionsRef.current, props);
        checkForDeprecations(props);
        var createUiCallback = function(context2) {
          setContext(context2);
          destroyFuncs.current.push(function() {
            context2.destroy();
          });
          var ctrlsService = context2.getBean(ag_grid_community_1.CtrlsService.NAME);
          ctrlsService.whenReady(function() {
            debug("AgGridReactUi. ctlService is ready");
            if (context2.isDestroyed()) {
              return;
            }
            if (gridOptionsRef.current) {
              var api = gridOptionsRef.current.api;
              if (api) {
                if (props.setGridApi) {
                  props.setGridApi(api, gridOptionsRef.current.columnApi);
                }
              }
            }
          });
        };
        var acceptChangesCallback = function(context2) {
          var ctrlsService = context2.getBean(ag_grid_community_1.CtrlsService.NAME);
          ctrlsService.whenReady(function() {
            debug("AgGridReactUi.acceptChangesCallback");
            whenReadyFuncs.current.forEach(function(f) {
              return f();
            });
            whenReadyFuncs.current.length = 0;
            ready.current = true;
          });
        };
        var gridCoreCreator = new ag_grid_community_1.GridCoreCreator();
        gridCoreCreator.create(eGui.current, gridOptionsRef.current, createUiCallback, acceptChangesCallback, gridParams);
      }, []);
      var style = react_1.useMemo(function() {
        return __assign({ height: "100%" }, props.containerStyle || {});
      }, [props.containerStyle]);
      var processWhenReady = react_1.useCallback(function(func) {
        if (ready.current) {
          debug("AgGridReactUi.processWhenReady sync");
          func();
        } else {
          debug("AgGridReactUi.processWhenReady async");
          whenReadyFuncs.current.push(func);
        }
      }, []);
      react_1.useEffect(function() {
        var changes = {};
        extractGridPropertyChanges(prevProps.current, props, changes);
        prevProps.current = props;
        processWhenReady(function() {
          var _a2;
          if ((_a2 = gridOptionsRef.current) === null || _a2 === void 0 ? void 0 : _a2.api) {
            ag_grid_community_1.ComponentUtil.processOnChange(changes, gridOptionsRef.current.api);
          }
        });
      }, [props]);
      return react_1.default.createElement(
        "div",
        { style, className: props.className, ref: setRef },
        context && !context.isDestroyed() ? react_1.default.createElement(gridComp_1.default, { context }) : null,
        (_b = (_a = portalManager.current) === null || _a === void 0 ? void 0 : _a.getPortals()) !== null && _b !== void 0 ? _b : null
      );
    };
    exports.AgGridReactUi = AgGridReactUi;
    var ReactFrameworkComponentWrapper = (
      /** @class */
      function(_super) {
        __extends(ReactFrameworkComponentWrapper2, _super);
        function ReactFrameworkComponentWrapper2(parent) {
          var _this = _super.call(this) || this;
          _this.parent = parent;
          return _this;
        }
        ReactFrameworkComponentWrapper2.prototype.createWrapper = function(UserReactComponent, componentType) {
          return new newReactComponent_1.NewReactComponent(UserReactComponent, this.parent, componentType);
        };
        return ReactFrameworkComponentWrapper2;
      }(ag_grid_community_1.BaseComponentWrapper)
    );
    function extractGridPropertyChanges(prevProps, nextProps, changes) {
      var debugLogging = !!nextProps.debug;
      Object.keys(nextProps).forEach(function(propKey) {
        if (ag_grid_community_1.ComponentUtil.ALL_PROPERTIES_SET.has(propKey)) {
          if (prevProps[propKey] !== nextProps[propKey]) {
            if (debugLogging) {
              console.log(" agGridReact: [" + propKey + "] property changed");
            }
            changes[propKey] = {
              previousValue: prevProps[propKey],
              currentValue: nextProps[propKey]
            };
          }
        }
      });
      ag_grid_community_1.ComponentUtil.EVENT_CALLBACKS.forEach(function(funcName) {
        if (prevProps[funcName] !== nextProps[funcName]) {
          if (debugLogging) {
            console.log("agGridReact: [" + funcName + "] event callback changed");
          }
          changes[funcName] = {
            previousValue: prevProps[funcName],
            currentValue: nextProps[funcName]
          };
        }
      });
    }
  }
});

// node_modules/ag-grid-react/lib/reactUi/cellRenderer/detailCellRenderer.js
var require_detailCellRenderer = __commonJS({
  "node_modules/ag-grid-react/lib/reactUi/cellRenderer/detailCellRenderer.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var react_1 = __importStar(require_react());
    var utils_1 = require_utils();
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var beansContext_1 = require_beansContext();
    var agGridReactUi_1 = require_agGridReactUi();
    var DetailCellRenderer = function(props, ref) {
      var _a = react_1.useContext(beansContext_1.BeansContext), ctrlsFactory = _a.ctrlsFactory, context = _a.context, gridOptionsService = _a.gridOptionsService, resizeObserverService = _a.resizeObserverService, clientSideRowModel = _a.clientSideRowModel, serverSideRowModel = _a.serverSideRowModel;
      var _b = react_1.useState(function() {
        return new utils_1.CssClasses();
      }), cssClasses = _b[0], setCssClasses = _b[1];
      var _c = react_1.useState(function() {
        return new utils_1.CssClasses();
      }), gridCssClasses = _c[0], setGridCssClasses = _c[1];
      var _d = react_1.useState(), detailGridOptions = _d[0], setDetailGridOptions = _d[1];
      var _e = react_1.useState(), detailRowData = _e[0], setDetailRowData = _e[1];
      var ctrlRef = react_1.useRef();
      var eGuiRef = react_1.useRef(null);
      var resizeObserverDestroyFunc = react_1.useRef();
      var parentModules = react_1.useMemo(function() {
        return ag_grid_community_1.ModuleRegistry.__getGridRegisteredModules(props.api.getGridId());
      }, [props]);
      var topClassName = react_1.useMemo(function() {
        return cssClasses.toString() + " ag-details-row";
      }, [cssClasses]);
      var gridClassName = react_1.useMemo(function() {
        return gridCssClasses.toString() + " ag-details-grid";
      }, [gridCssClasses]);
      if (ref) {
        react_1.useImperativeHandle(ref, function() {
          return {
            refresh: function() {
              var _a2, _b2;
              return (_b2 = (_a2 = ctrlRef.current) === null || _a2 === void 0 ? void 0 : _a2.refresh()) !== null && _b2 !== void 0 ? _b2 : false;
            }
          };
        });
      }
      if (props.template) {
        ag_grid_community_1._.doOnce(function() {
          return console.warn("AG Grid: detailCellRendererParams.template is not supported by AG Grid React. To change the template, provide a Custom Detail Cell Renderer. See https://ag-grid.com/react-data-grid/master-detail-custom-detail/");
        }, "React_detailCellRenderer.template");
      }
      var setRef = react_1.useCallback(function(e) {
        eGuiRef.current = e;
        if (!eGuiRef.current) {
          context.destroyBean(ctrlRef.current);
          if (resizeObserverDestroyFunc.current) {
            resizeObserverDestroyFunc.current();
          }
          return;
        }
        var compProxy = {
          addOrRemoveCssClass: function(name, on) {
            return setCssClasses(function(prev) {
              return prev.setClass(name, on);
            });
          },
          addOrRemoveDetailGridCssClass: function(name, on) {
            return setGridCssClasses(function(prev) {
              return prev.setClass(name, on);
            });
          },
          setDetailGrid: function(gridOptions) {
            return setDetailGridOptions(gridOptions);
          },
          setRowData: function(rowData) {
            return setDetailRowData(rowData);
          },
          getGui: function() {
            return eGuiRef.current;
          }
        };
        var ctrl = ctrlsFactory.getInstance("detailCellRenderer");
        if (!ctrl) {
          return;
        }
        context.createBean(ctrl);
        ctrl.init(compProxy, props);
        ctrlRef.current = ctrl;
        if (gridOptionsService.is("detailRowAutoHeight")) {
          var checkRowSizeFunc = function() {
            if (eGuiRef.current == null) {
              return;
            }
            var clientHeight = eGuiRef.current.clientHeight;
            if (clientHeight != null && clientHeight > 0) {
              var updateRowHeightFunc = function() {
                props.node.setRowHeight(clientHeight);
                if (clientSideRowModel) {
                  clientSideRowModel.onRowHeightChanged();
                } else if (serverSideRowModel) {
                  serverSideRowModel.onRowHeightChanged();
                }
              };
              setTimeout(updateRowHeightFunc, 0);
            }
          };
          resizeObserverDestroyFunc.current = resizeObserverService.observeResize(eGuiRef.current, checkRowSizeFunc);
          checkRowSizeFunc();
        }
      }, []);
      var setGridApi = react_1.useCallback(function(api, columnApi) {
        var _a2;
        (_a2 = ctrlRef.current) === null || _a2 === void 0 ? void 0 : _a2.registerDetailWithMaster(api, columnApi);
      }, []);
      return react_1.default.createElement("div", { className: topClassName, ref: setRef }, detailGridOptions && react_1.default.createElement(agGridReactUi_1.AgGridReactUi, __assign({ className: gridClassName }, detailGridOptions, { modules: parentModules, rowData: detailRowData, setGridApi })));
    };
    exports.default = react_1.forwardRef(DetailCellRenderer);
  }
});

// node_modules/ag-grid-react/lib/shared/reactFrameworkOverrides.js
var require_reactFrameworkOverrides = __commonJS({
  "node_modules/ag-grid-react/lib/shared/reactFrameworkOverrides.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReactFrameworkOverrides = void 0;
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var groupCellRenderer_1 = __importDefault(require_groupCellRenderer());
    var detailCellRenderer_1 = __importDefault(require_detailCellRenderer());
    var ReactFrameworkOverrides = (
      /** @class */
      function(_super) {
        __extends(ReactFrameworkOverrides2, _super);
        function ReactFrameworkOverrides2(reactUi) {
          var _this = _super.call(this) || this;
          _this.frameworkComponents = {
            agGroupCellRenderer: groupCellRenderer_1.default,
            agGroupRowRenderer: groupCellRenderer_1.default,
            agDetailCellRenderer: detailCellRenderer_1.default
          };
          _this.reactUi = reactUi;
          _this.renderingEngine = reactUi ? "react" : "vanilla";
          return _this;
        }
        ReactFrameworkOverrides2.prototype.frameworkComponent = function(name) {
          if (!this.reactUi) {
            return;
          }
          return this.frameworkComponents[name];
        };
        ReactFrameworkOverrides2.prototype.isFrameworkComponent = function(comp) {
          if (!comp) {
            return false;
          }
          var prototype = comp.prototype;
          var isJsComp = prototype && "getGui" in prototype;
          return !isJsComp;
        };
        return ReactFrameworkOverrides2;
      }(ag_grid_community_1.VanillaFrameworkOverrides)
    );
    exports.ReactFrameworkOverrides = ReactFrameworkOverrides;
  }
});

// node_modules/ag-grid-react/lib/legacy/agGridReactLegacy.js
var require_agGridReactLegacy = __commonJS({
  "node_modules/ag-grid-react/lib/legacy/agGridReactLegacy.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AgGridReactLegacy = void 0;
    var ag_grid_community_1 = (init_ag_grid_community_auto_esm(), __toCommonJS(ag_grid_community_auto_esm_exports));
    var prop_types_1 = __importDefault(require_prop_types());
    var react_1 = __importStar(require_react());
    var legacyReactComponent_1 = require_legacyReactComponent();
    var newReactComponent_1 = require_newReactComponent();
    var portalManager_1 = require_portalManager();
    var reactFrameworkOverrides_1 = require_reactFrameworkOverrides();
    var AgGridReactLegacy = (
      /** @class */
      function(_super) {
        __extends(AgGridReactLegacy2, _super);
        function AgGridReactLegacy2(props) {
          var _this = _super.call(this, props) || this;
          _this.props = props;
          _this.api = null;
          _this.destroyed = false;
          _this.SYNCHRONOUS_CHANGE_PROPERTIES = ["context"];
          _this.portalManager = new portalManager_1.LegacyPortalManager(_this, props.componentWrappingElement, props.maxComponentCreationTimeMs);
          return _this;
        }
        AgGridReactLegacy2.prototype.render = function() {
          var _this = this;
          return react_1.default.createElement("div", {
            style: this.createStyleForDiv(),
            className: this.props.className,
            ref: function(e) {
              _this.eGridDiv = e;
            }
          }, this.portalManager.getPortals());
        };
        AgGridReactLegacy2.prototype.createStyleForDiv = function() {
          return __assign({ height: "100%" }, this.props.containerStyle || {});
        };
        AgGridReactLegacy2.prototype.componentDidMount = function() {
          var modules = this.props.modules || [];
          var gridParams = {
            providedBeanInstances: {
              agGridReact: this,
              frameworkComponentWrapper: new ReactFrameworkComponentWrapper(this, this.portalManager)
            },
            modules,
            frameworkOverrides: new reactFrameworkOverrides_1.ReactFrameworkOverrides(false)
          };
          var gridOptions = this.props.gridOptions || {};
          this.gridOptions = ag_grid_community_1.ComponentUtil.copyAttributesToGridOptions(gridOptions, this.props);
          this.checkForDeprecations(this.props);
          new ag_grid_community_1.Grid(this.eGridDiv, this.gridOptions, gridParams);
          this.api = this.gridOptions.api;
          this.columnApi = this.gridOptions.columnApi;
          this.props.setGridApi(this.api, this.columnApi);
        };
        AgGridReactLegacy2.prototype.checkForDeprecations = function(props) {
          if (props.rowDataChangeDetectionStrategy) {
            ag_grid_community_1._.doOnce(function() {
              return console.warn("AG Grid: Since v29 rowDataChangeDetectionStrategy has been deprecated. Row data property changes will be compared by reference via triple equals ===. See https://ag-grid.com/react-data-grid/react-hooks/");
            }, "rowDataChangeDetectionStrategy_Deprecation");
          }
        };
        AgGridReactLegacy2.prototype.shouldComponentUpdate = function(nextProps) {
          this.processPropsChanges(this.props, nextProps);
          return false;
        };
        AgGridReactLegacy2.prototype.componentDidUpdate = function(prevProps) {
          this.processPropsChanges(prevProps, this.props);
        };
        AgGridReactLegacy2.prototype.processPropsChanges = function(prevProps, nextProps) {
          var changes = {};
          this.extractGridPropertyChanges(prevProps, nextProps, changes);
          this.processSynchronousChanges(changes);
          this.processAsynchronousChanges(changes);
        };
        AgGridReactLegacy2.prototype.extractGridPropertyChanges = function(prevProps, nextProps, changes) {
          var debugLogging = !!nextProps.debug;
          Object.keys(nextProps).forEach(function(propKey) {
            if (ag_grid_community_1.ComponentUtil.ALL_PROPERTIES_SET.has(propKey)) {
              if (prevProps[propKey] !== nextProps[propKey]) {
                if (debugLogging) {
                  console.log("agGridReact: [" + propKey + "] property changed");
                }
                changes[propKey] = {
                  previousValue: prevProps[propKey],
                  currentValue: nextProps[propKey]
                };
              }
            }
          });
          ag_grid_community_1.ComponentUtil.EVENT_CALLBACKS.forEach(function(funcName) {
            if (prevProps[funcName] !== nextProps[funcName]) {
              if (debugLogging) {
                console.log("agGridReact: [" + funcName + "] event callback changed");
              }
              changes[funcName] = {
                previousValue: prevProps[funcName],
                currentValue: nextProps[funcName]
              };
            }
          });
        };
        AgGridReactLegacy2.prototype.componentWillUnmount = function() {
          if (this.api) {
            this.api.destroy();
            this.api = null;
          }
          this.destroyed = true;
          this.portalManager.destroy();
        };
        AgGridReactLegacy2.prototype.isDisableStaticMarkup = function() {
          return this.props.disableStaticMarkup === true;
        };
        AgGridReactLegacy2.prototype.isLegacyComponentRendering = function() {
          return this.props.legacyComponentRendering === true;
        };
        AgGridReactLegacy2.prototype.processSynchronousChanges = function(changes) {
          var asyncChanges = __assign({}, changes);
          if (Object.keys(asyncChanges).length > 0) {
            var synchronousChanges_1 = {};
            this.SYNCHRONOUS_CHANGE_PROPERTIES.forEach(function(synchronousChangeProperty) {
              if (asyncChanges[synchronousChangeProperty]) {
                synchronousChanges_1[synchronousChangeProperty] = asyncChanges[synchronousChangeProperty];
                delete asyncChanges[synchronousChangeProperty];
              }
            });
            if (Object.keys(synchronousChanges_1).length > 0 && !!this.api) {
              ag_grid_community_1.ComponentUtil.processOnChange(synchronousChanges_1, this.api);
            }
          }
          return asyncChanges;
        };
        AgGridReactLegacy2.prototype.processAsynchronousChanges = function(changes) {
          var _this = this;
          if (Object.keys(changes).length > 0) {
            window.setTimeout(function() {
              if (_this.api) {
                ag_grid_community_1.ComponentUtil.processOnChange(changes, _this.api);
              }
            });
          }
        };
        AgGridReactLegacy2.MAX_COMPONENT_CREATION_TIME_IN_MS = 1e3;
        AgGridReactLegacy2.defaultProps = {
          legacyComponentRendering: false,
          disableStaticMarkup: false,
          maxComponentCreationTimeMs: AgGridReactLegacy2.MAX_COMPONENT_CREATION_TIME_IN_MS
        };
        return AgGridReactLegacy2;
      }(react_1.Component)
    );
    exports.AgGridReactLegacy = AgGridReactLegacy;
    AgGridReactLegacy.propTypes = {
      gridOptions: prop_types_1.default.object
    };
    addProperties(ag_grid_community_1.ComponentUtil.EVENT_CALLBACKS, prop_types_1.default.func);
    addProperties(ag_grid_community_1.ComponentUtil.BOOLEAN_PROPERTIES, prop_types_1.default.bool);
    addProperties(ag_grid_community_1.ComponentUtil.STRING_PROPERTIES, prop_types_1.default.string);
    addProperties(ag_grid_community_1.ComponentUtil.OBJECT_PROPERTIES, prop_types_1.default.object);
    addProperties(ag_grid_community_1.ComponentUtil.ARRAY_PROPERTIES, prop_types_1.default.array);
    addProperties(ag_grid_community_1.ComponentUtil.NUMBER_PROPERTIES, prop_types_1.default.number);
    addProperties(ag_grid_community_1.ComponentUtil.FUNCTION_PROPERTIES, prop_types_1.default.func);
    function addProperties(listOfProps, propType) {
      listOfProps.forEach(function(propKey) {
        AgGridReactLegacy[propKey] = propType;
      });
    }
    var ReactFrameworkComponentWrapper = (
      /** @class */
      function(_super) {
        __extends(ReactFrameworkComponentWrapper2, _super);
        function ReactFrameworkComponentWrapper2(agGridReact, portalManager) {
          var _this = _super.call(this) || this;
          _this.agGridReact = agGridReact;
          _this.portalManager = portalManager;
          return _this;
        }
        ReactFrameworkComponentWrapper2.prototype.createWrapper = function(UserReactComponent, componentType) {
          if (this.agGridReact.isLegacyComponentRendering()) {
            return new legacyReactComponent_1.LegacyReactComponent(UserReactComponent, this.agGridReact, this.portalManager, componentType);
          } else {
            return new newReactComponent_1.NewReactComponent(UserReactComponent, this.portalManager, componentType);
          }
        };
        return ReactFrameworkComponentWrapper2;
      }(ag_grid_community_1.BaseComponentWrapper)
    );
  }
});

// node_modules/ag-grid-react/lib/agGridReact.js
var require_agGridReact = __commonJS({
  "node_modules/ag-grid-react/lib/agGridReact.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AgGridReact = void 0;
    var react_1 = __importStar(require_react());
    var agGridReactLegacy_1 = require_agGridReactLegacy();
    var agGridReactUi_1 = require_agGridReactUi();
    var AgGridReact = (
      /** @class */
      function(_super) {
        __extends(AgGridReact2, _super);
        function AgGridReact2() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.setGridApi = function(api, columnApi) {
            _this.api = api;
            _this.columnApi = columnApi;
          };
          return _this;
        }
        AgGridReact2.prototype.render = function() {
          var ReactComponentToUse = this.props.suppressReactUi ? react_1.default.createElement(agGridReactLegacy_1.AgGridReactLegacy, __assign({}, this.props, { setGridApi: this.setGridApi })) : react_1.default.createElement(agGridReactUi_1.AgGridReactUi, __assign({}, this.props, { setGridApi: this.setGridApi }));
          return ReactComponentToUse;
        };
        return AgGridReact2;
      }(react_1.Component)
    );
    exports.AgGridReact = AgGridReact;
  }
});

// node_modules/ag-grid-react/lib/shared/interfaces.js
var require_interfaces = __commonJS({
  "node_modules/ag-grid-react/lib/shared/interfaces.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChangeDetectionStrategyType = void 0;
    var ChangeDetectionStrategyType;
    (function(ChangeDetectionStrategyType2) {
      ChangeDetectionStrategyType2["IdentityCheck"] = "IdentityCheck";
      ChangeDetectionStrategyType2["DeepValueCheck"] = "DeepValueCheck";
      ChangeDetectionStrategyType2["NoCheck"] = "NoCheck";
    })(ChangeDetectionStrategyType = exports.ChangeDetectionStrategyType || (exports.ChangeDetectionStrategyType = {}));
  }
});

// node_modules/ag-grid-react/lib/main.js
var require_main = __commonJS({
  "node_modules/ag-grid-react/lib/main.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AgGridReactFire = exports.AgGridReactLegacy = exports.AgGridReact = void 0;
    var agGridReact_1 = require_agGridReact();
    Object.defineProperty(exports, "AgGridReact", { enumerable: true, get: function() {
      return agGridReact_1.AgGridReact;
    } });
    var agGridReactLegacy_1 = require_agGridReactLegacy();
    Object.defineProperty(exports, "AgGridReactLegacy", { enumerable: true, get: function() {
      return agGridReactLegacy_1.AgGridReactLegacy;
    } });
    var agGridReactUi_1 = require_agGridReactUi();
    Object.defineProperty(exports, "AgGridReactFire", { enumerable: true, get: function() {
      return agGridReactUi_1.AgGridReactUi;
    } });
    __exportStar(require_interfaces(), exports);
  }
});
export default require_main();
/*! Bundled license information:

react-dom/cjs/react-dom-server-legacy.browser.development.js:
  (**
   * @license React
   * react-dom-server-legacy.browser.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-server.browser.development.js:
  (**
   * @license React
   * react-dom-server.browser.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=ag-grid-react.js.map
