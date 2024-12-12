import createStyles from '@mui/styles/createStyles'
import { makeStyles } from '@mui/styles'
import { pad } from 'lodash'

const useStyles = makeStyles((theme) =>
  createStyles({
    '@global': {
      '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      },
      html: {
        '-webkit-font-smoothing': 'antialiased',
        '-moz-osx-font-smoothing': 'grayscale',
        height: '100%',
        width: '100%',
      },
      body: {
        height: '100%',
        width: '100%',
        backgroundColor: theme.palette.background.default,
      },
      main: {
        height: '100%',
        width: '100%',
        backgroundColor: theme.palette.background.default,
      },
      a: {
        textDecoration: 'none',
      },
      p: {
        fontFamily: 'Gilroy',
        fontSize: 14,
        lineHeight: '16px',
        fontWeight: 500,
        color: theme.palette.text.primary,
      },
      'h1, h2, h3, h4, h5, h5': {
        fontFamily: 'Gilroy',
        color: theme.palette.text.primary,
      },
      '#root': {
        height: '100%',
        width: '100%',
      },
      '.Toastify__toast': {
        boxShadow: theme.boxShadow['32-12'],
      },

      // DatePicker

      '.datepicker .react-datepicker': {
        backgroundColor: theme.palette.background.default,
        boxShadow: theme.boxShadow['16-8'],
      },
      '.datepicker .react-datepicker__header': {
        backgroundColor: theme.palette.background.default,
      },

      '.datepicker .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header': {
        color: theme.palette.gray[600],
      },

      '.datepicker .react-datepicker__day-name': {
        color: theme.palette.orange[500],
      },

      '.datepicker .react-datepicker__day': {
        color: theme.palette.gray[600],
      },
      '.datepicker .react-datepicker__day--in-range': {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.orange[600],
      },
      '.datepicker .react-datepicker__day--outside-month': {
        color: theme.palette.gray[400],
      },
      '.datepicker .react-datepicker__day--selected': {
        backgroundColor: theme.palette.orange[600],
        color: theme.palette.common.white,
      },
      '.datepicker .react-datepicker__year-text--keyboard-selected': {
        backgroundColor: theme.palette.orange[600],
        color: theme.palette.common.white,
      },
      '.datepicker .react-datepicker__day:hover': {
        backgroundColor: theme.palette.orange[600],
        color: theme.palette.common.white,
      },
      '.react-datepicker__day--disabled': {
        color: `${theme.palette.gray[100]} !important`,
      },

      '.datepicker .react-datepicker__navigation-icon::before, .react-datepicker__year-read-view--down-arrow, .react-datepicker__month-read-view--down-arrow, .react-datepicker__month-year-read-view--down-arrow':
        {
          borderColor: theme.palette.orange[500],
        },
      '.react-datepicker__day--keyboard-selected, .react-datepicker__month-text--keyboard-selected, .react-datepicker__quarter-text--keyboard-selected, .react-datepicker__year-text--keyboard-selected':
        {
          color: `${theme.palette.common.white} !important`,
          backgroundColor: `${theme.palette.orange[500]} !important`,
        },

      // multi option select :only color:
      '.label': {
        color: theme.palette.gray[600],
      },
      '.selection': {
        background: theme.palette.gray[100],
      },
      '.selectionError': {
        background: theme.palette.gray[100],
      },
      '.selection:hover': {
        background: theme.palette.gray[101],
      },
      '.selectionError:hover': {
        background: theme.palette.gray[101],
      },
      '.multiple.value': {
        color: theme.palette.gray[600],
      },
      '.options': {
        background: theme.palette.gray[100],
        boxShadow: theme.boxShadow['16-8'],
      },
      '.option': {
        color: theme.palette.gray[600],
      },
      '.option:hover': {
        background: theme.palette.gray[101],
      },
      '.option.all': {
        borderColor: theme.palette.gray[200],
      },

      // rich text editor :only color:
      '.rdw-storybook-root': {
        backgroundColor: theme.palette.gray[100],
      },
      '.ag-floating-bottom-viewport .ag-row-pinned': {
        backgroundColor: theme.palette.background.default + ' !important',
        boxShadow: theme.boxShadow['16-8'],
      },
      '.rdw-option-wrapper:active': {
        backgroundColor: theme.palette.gray[100],
      },
      '.rdw-storybook-root1': {
        backgroundColor: theme.palette.gray[100],
      },
      '.rdw-storybook-root:hover': {
        backgroundColor: theme.palette.gray[101],
      },
      '.rdw-editor-toolbar': {
        backgroundColor: theme.palette.gray[100],
      },
      '.rdw-editor-toolbar:hover': {
        backgroundColor: theme.palette.gray[101],
      },
      '.rdw-option-wrapper:hover': {
        backgroundColor: theme.palette.gray[101],
      },
      '.rdw-option-wrapper': {
        backgroundColor: theme.palette.background.default,
        boxShadow: theme.boxShadow['16-8'],
      },
      '.rdw-dropdown-wrapper': {
        backgroundColor: theme.palette.background.default,
        boxShadow: theme.boxShadow['16-8'],
      },
      '.rdw-dropdown-selectedtext': {
        color: theme.palette.gray[600],
      },
      '.rdw-dropdown-selectedtext:hover': {
        color: theme.palette.gray[600],
      },
      '.rdw-dropdown-optionwrapper': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.gray[600],
      },
      '.rdw-dropdownoption-highlighted': {
        backgroundColor: theme.palette.gray[100],
      },
      '.rdw-dropdownoption-active': {
        backgroundColor: theme.palette.gray[101],
      },
      '.DraftEditor-editorContainer, .DraftEditor-root, .public-DraftEditor-content': {
        color: theme.palette.gray[600],
      },
      '.rdw-option-active': {
        backgroundColor: theme.palette.gray[101],
      },

      // ag grid styles :only color:
      '.ag-theme-alpine.ag-dnd-ghost': {
        backgroundColor: theme.palette.background.default + ' !important',
        borderColor: theme.palette.background.default + ' !important',
        boxShadow: theme.boxShadow['16-8'],
      },
      '.no-rows-root h3': {
        color: theme.palette.gray[600],
      },
      '.ag-dnd-ghost-label': {
        color: theme.palette.gray[600],
      },
      '.shopListLeft': {
        borderLeft: `2px solid ${theme.palette.gray[200]} !important`,
        borderRadius: '0 !important',
      },
      '.ag-theme-alpine .cell-class.shoCellLeft': {
        borderLeft: `2px solid ${theme.palette.gray[200]} !important`,
      },
      '.ag-theme-alpine .cell-class.shopCellRight': {
        borderRight: `2px solid ${theme.palette.gray[200]} !important`,
        borderRadius: '0 !important',
      },
      '.shopCellLeft': {
        borderLeft: `2px solid ${theme.palette.gray[200]} !important`,
      },
      '.shopListRight': {
        borderRight: `2px solid ${theme.palette.gray[200]} !important`,
        borderRadius: '0 !important',
      },
      '.shopCellRight': {
        borderRight: `2px solid ${theme.palette.gray[200]} !important`,
        borderRadius: '0 !important',
      },
      '.ag-theme-alpine .product-efficiency:hover': {
        background: theme.palette.gray[100],
      },
      '.cell-class': {
        color: theme.palette.gray[600],
      },
      '.ag-theme-alpine .ag-root-wrapper': {
        background: theme.palette.background.default,
      },
      '.ag-theme-alpine .ag-menu-list': {
        background: theme.palette.background.default,
      },
      '.ag-theme-alpine .ag-header': {
        borderColor: theme.palette.bunker[100],
        borderBottom: 'transparent',
        background: theme.palette.gray[50],
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 48,
      },
      '.ag-theme-alpine .ag-header-group-cell-label:hover': {
        background: theme.palette.gray[400],
      },
      '.ag-theme-alpine .ag-header-group-cell-label .ag-header-group-text': {
        color: theme.palette.black,
      },
      '.custom-group-cell': {
        color: theme.palette.gray[600],
      },
      '.custom-group-cell:hover': {
        background: theme.palette.gray[100],
      },
      '.ag-row-hover': {
        color: 'red !important',
      },

      '.ag-theme-alpine .ag-header-cell:hover': {
        background: theme.palette.gray[100],
      },
      // '.ag-header-row.ag-header-row-column': {
      //   backgroundColor: theme.palette.gray[50],
      // },
      '.ag-cell-label-container': {
        padding: '12px',
      },
      '.ag-body': {
        borderColor: theme.palette.bunker[100],
        border: '1px solid',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
        overflow: 'hidden',
      },
      '.ag-theme-alpine .ag-cell.ag-cell-first-right-pinned:not(.ag-cell-range-left):not(.ag-cell-range-single-cell)': {
        borderLeft: 'none !important',
        boxShadow: '-2px 0px 8px 0px #0000000A',
      },
      '.ag-theme-alpine .ag-pinned-right-header': {
        borderLeft: 'none !important',
        boxShadow: '-2px 0px 8px 0px #0000000A',
      },
      '.ag-pinned-right-cols-container': {
        marginRight: '0 !important',
      },
      '.ag-header-cell-label .ag-header-cell-text': {
        color: theme.palette.dark[500],
        fontWeight: '600',
        fontSize: '16px',
        lineHeight: '24px',
      },
      '.ag-theme-alpine .ag-header-icon': {
        color: theme.palette.gray[400],
      },
      '.ag-tabs.ag-menu': {
        boxShadow: theme.boxShadow['64-16'],
      },
      '.ag-theme-alpine .ag-menu-option-text': {
        color: theme.palette.gray[400],
      },
      '.ag-theme-alpine .ag-menu-option-active': {
        background: theme.palette.gray[100],
      },
      '.ag-theme-alpine .ag-menu-separator': {
        background: theme.palette.gray[200],
      },
      '.ag-row.ag-row-odd': {
        background: 'none',
      },
      ".ag-menu.ag-ltr.ag-popup-child[aria-label='SubMenu']": {
        background: theme.palette.background.default,
        boxShadow: theme.boxShadow['16-8'],
      },
      '.ag-theme-alpine .ag-paging-panel': {
        borderColor: theme.palette.gray[200],
      },
      '.no-rows-container': {
        borderColor: theme.palette.gray[300],
      },
      '.no-rows-root p': {
        color: theme.palette.gray[300],
      },
      '.ag-theme-alpine .ag-pinned-left-header': {
        borderColor: theme.palette.gray[200] + ' !important',
      },
      '.ag-theme-alpine.ag-cell .ag-cell-last-left-pinned:not(.ag-cell-range-right):not(.ag-cell-range-single-cell)': {
        borderColor: theme.palette.gray[200],
      },
      '.ag-theme-alpine.ag-cell .ag-cell-first-right-pinned:not(.ag-cell-range-left):not(.ag-cell-range-single-cell)': {
        borderColor: theme.palette.gray[200],
      },
    },
  })
)

const GlobalStyles = () => {
  useStyles()
  return null
}

export default GlobalStyles
