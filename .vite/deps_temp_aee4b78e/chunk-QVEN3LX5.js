import {
  Typography_default
} from "./chunk-7B7EXASN.js";
import {
  DialogContext_default
} from "./chunk-6T2V4TGN.js";
import {
  styled_default,
  useThemeProps2 as useThemeProps
} from "./chunk-XLTZF2MZ.js";
import {
  clsx_default
} from "./chunk-7TZKSHV3.js";
import {
  composeClasses,
  generateUtilityClass,
  generateUtilityClasses,
  require_jsx_runtime
} from "./chunk-EPORQ3VD.js";
import {
  _objectWithoutPropertiesLoose
} from "./chunk-RI6IZD6A.js";
import {
  _extends,
  init_extends
} from "./chunk-BHQZLMRL.js";
import {
  require_prop_types
} from "./chunk-RAGCF636.js";
import {
  require_react
} from "./chunk-Y4QS4IRT.js";
import {
  __toESM
} from "./chunk-PLDDJCW6.js";

// node_modules/@mui/material/DialogTitle/DialogTitle.js
init_extends();
var React = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());

// node_modules/@mui/material/DialogTitle/dialogTitleClasses.js
function getDialogTitleUtilityClass(slot) {
  return generateUtilityClass("MuiDialogTitle", slot);
}
var dialogTitleClasses = generateUtilityClasses("MuiDialogTitle", ["root"]);
var dialogTitleClasses_default = dialogTitleClasses;

// node_modules/@mui/material/DialogTitle/DialogTitle.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var _excluded = ["className", "id"];
var useUtilityClasses = (ownerState) => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ["root"]
  };
  return composeClasses(slots, getDialogTitleUtilityClass, classes);
};
var DialogTitleRoot = styled_default(Typography_default, {
  name: "MuiDialogTitle",
  slot: "Root",
  overridesResolver: (props, styles) => styles.root
})({
  padding: "16px 24px",
  flex: "0 0 auto"
});
var DialogTitle = React.forwardRef(function DialogTitle2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: "MuiDialogTitle"
  });
  const {
    className,
    id: idProp
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded);
  const ownerState = props;
  const classes = useUtilityClasses(ownerState);
  const {
    titleId = idProp
  } = React.useContext(DialogContext_default);
  return (0, import_jsx_runtime.jsx)(DialogTitleRoot, _extends({
    component: "h2",
    className: clsx_default(classes.root, className),
    ownerState,
    ref,
    variant: "h6",
    id: idProp != null ? idProp : titleId
  }, other));
});
true ? DialogTitle.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   */
  children: import_prop_types.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types.default.object,
  /**
   * @ignore
   */
  className: import_prop_types.default.string,
  /**
   * @ignore
   */
  id: import_prop_types.default.string,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types.default.oneOfType([import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object, import_prop_types.default.bool])), import_prop_types.default.func, import_prop_types.default.object])
} : void 0;
var DialogTitle_default = DialogTitle;

export {
  getDialogTitleUtilityClass,
  dialogTitleClasses_default,
  DialogTitle_default
};
//# sourceMappingURL=chunk-QVEN3LX5.js.map
