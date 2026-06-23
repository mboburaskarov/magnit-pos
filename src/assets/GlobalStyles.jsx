import { GlobalStyles as MuiGlobalStyles, useTheme } from '@mui/material'

const GlobalStyles = () => {
  const theme = useTheme()
  const palette = theme.palette

  return (
    <MuiGlobalStyles
      styles={{
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
        },
        html: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          height: '100%',
          width: '100%',
        },
        body: {
          height: '100%',
          width: '100%',
          backgroundColor: palette.background?.default,
        },
        main: {
          height: '100%',
          width: '100%',
          backgroundColor: palette.background?.default,
        },
        a: {
          textDecoration: 'none',
        },
        p: {
          fontSize: 14,
          lineHeight: '16px',
          fontWeight: 500,
          color: palette.text?.primary,
        },
        'h1, h2, h3, h4, h5': {
          color: palette.text?.primary,
        },
        '#root': {
          height: '100%',
          width: '100%',
        },
        '.Toastify__toast': {
          boxShadow: theme.boxShadow?.['32-12'],
        },

        '.datepicker .react-datepicker': {
          backgroundColor: palette.background?.default,
          boxShadow: theme.boxShadow?.['16-8'],
        },
        '.datepicker .react-datepicker__header': {
          backgroundColor: palette.background?.default,
        },

        '.datepicker .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header':
          {
            color: palette.gray?.[600],
          },

        '.datepicker .react-datepicker__day-name': {
          color: palette.orange?.[500],
        },

        '.datepicker .react-datepicker__day': {
          color: palette.gray?.[600],
        },
        '.datepicker .react-datepicker__day--in-range': {
          color: palette.common?.white,
          backgroundColor: palette.orange?.[600],
        },
        '.datepicker .react-datepicker__day--outside-month': {
          color: palette.bunker?.[900],
        },
        '.datepicker .react-datepicker__day--selected': {
          backgroundColor: palette.orange?.[600],
          color: palette.common?.white,
        },
        '.datepicker .react-datepicker__year-text--keyboard-selected': {
          backgroundColor: palette.orange?.[600],
          color: palette.common?.white,
        },
        '.datepicker .react-datepicker__day:hover': {
          backgroundColor: palette.orange?.[600],
          color: palette.common?.white,
        },
        '.react-datepicker__day--disabled': {
          color: `${palette.gray?.[400]} !important`,
        },

        '.datepicker .react-datepicker__navigation-icon::before, .react-datepicker__year-read-view--down-arrow, .react-datepicker__month-read-view--down-arrow, .react-datepicker__month-year-read-view--down-arrow':
          {
            borderColor: palette.orange?.[500],
          },
        '.react-datepicker__day--keyboard-selected, .react-datepicker__month-text--keyboard-selected, .react-datepicker__quarter-text--keyboard-selected, .react-datepicker__year-text--keyboard-selected':
          {
            color: `${palette.common?.white} !important`,
            backgroundColor: `${palette.orange?.[500]} !important`,
          },

        '.label': {
          color: palette.gray?.[600],
        },
        '.selection': {
          background: palette.gray?.[100],
        },
        '.selectionError': {
          background: palette.gray?.[100],
        },
        '.selection:hover': {
          background: palette.gray?.[101],
        },
        '.selectionError:hover': {
          background: palette.gray?.[101],
        },
        '.multiple.value': {
          color: palette.gray?.[600],
        },
        '.options': {
          background: palette.gray?.[100],
          boxShadow: theme.boxShadow?.['16-8'],
        },
        '.option': {
          color: palette.gray?.[600],
        },
        '.option:hover': {
          background: palette.gray?.[101],
        },
        '.option.all': {
          borderColor: palette.gray?.[200],
        },

        '.rdw-storybook-root': {
          backgroundColor: palette.gray?.[100],
        },
        '.ag-floating-bottom-viewport .ag-row-pinned': {
          backgroundColor: palette.background?.default + ' !important',
          boxShadow: theme.boxShadow?.['16-8'],
        },
        '.rdw-option-wrapper:active': {
          backgroundColor: palette.gray?.[100],
        },
        '.rdw-storybook-root1': {
          backgroundColor: palette.gray?.[100],
        },
        '.rdw-storybook-root:hover': {
          backgroundColor: palette.gray?.[101],
        },
        '.rdw-editor-toolbar': {
          backgroundColor: palette.gray?.[100],
        },
        '.rdw-editor-toolbar:hover': {
          backgroundColor: palette.gray?.[101],
        },
        '.rdw-option-wrapper:hover': {
          backgroundColor: palette.gray?.[101],
        },
        '.rdw-option-wrapper': {
          backgroundColor: palette.background?.default,
          boxShadow: theme.boxShadow?.['16-8'],
        },
        '.rdw-dropdown-wrapper': {
          backgroundColor: palette.background?.default,
          boxShadow: theme.boxShadow?.['16-8'],
        },
        '.rdw-dropdown-selectedtext': {
          color: palette.gray?.[600],
        },
        '.rdw-dropdown-selectedtext:hover': {
          color: palette.gray?.[600],
        },
        '.rdw-dropdown-optionwrapper': {
          backgroundColor: palette.background?.default,
          color: palette.gray?.[600],
        },
        '.rdw-dropdownoption-highlighted': {
          backgroundColor: palette.gray?.[100],
        },
        '.rdw-dropdownoption-active': {
          backgroundColor: palette.gray?.[101],
        },
        '.DraftEditor-editorContainer, .DraftEditor-root, .public-DraftEditor-content': {
          color: palette.gray?.[600],
        },
        '.rdw-option-active': {
          backgroundColor: palette.gray?.[101],
        },

        '.ag-theme-alpine.ag-dnd-ghost': {
          backgroundColor: palette.background?.default + ' !important',
          borderColor: palette.background?.default + ' !important',
          boxShadow: theme.boxShadow?.['16-8'],
        },
        '.no-rows-root h3': {
          color: palette.gray?.[600],
        },
        '.ag-dnd-ghost-label': {
          color: palette.gray?.[600],
        },
        '.shopListLeft': {
          borderLeft: `2px solid ${palette.gray?.[200]} !important`,
          borderRadius: '0 !important',
        },
        '.ag-theme-alpine .cell-class.shoCellLeft': {
          borderLeft: `2px solid ${palette.gray?.[200]} !important`,
        },
        '.ag-theme-alpine .cell-class.shopCellRight': {
          borderRight: `2px solid ${palette.gray?.[200]} !important`,
          borderRadius: '0 !important',
        },
        '.shopCellLeft': {
          borderLeft: `2px solid ${palette.gray?.[200]} !important`,
        },
        '.shopListRight': {
          borderRight: `2px solid ${palette.gray?.[200]} !important`,
          borderRadius: '0 !important',
        },
        '.shopCellRight': {
          borderRight: `2px solid ${palette.gray?.[200]} !important`,
          borderRadius: '0 !important',
        },
        '.ag-theme-alpine .product-efficiency:hover': {
          background: palette.gray?.[100],
        },
        '.cell-class': {
          color: palette.gray?.[600],
        },
        '.ag-theme-alpine .ag-root-wrapper': {
          background: palette.background?.default,
        },
        '.ag-theme-alpine .ag-menu-list': {
          background: palette.background?.default,
        },
        '.ag-theme-alpine .ag-header': {
          borderColor: palette.bunker?.[100],
          borderBottom: 'transparent',
          background: palette.gray?.[50],
          height: 48,
        },
        '.ag-theme-alpine .ag-header-group-cell-label:hover': {
          background: palette.gray?.[400],
        },
        '.ag-theme-alpine .ag-header-group-cell-label .ag-header-group-text': {
          color: palette.black,
        },
        '.custom-group-cell': {
          color: palette.gray?.[600],
        },
        '.custom-group-cell:hover': {
          background: palette.gray?.[100],
        },
        '.ag-row-hover': {
          color: 'red !important',
        },
        '.hover .ag-row:hover': {
          backgroundColor: `${palette.orange?.[150]} !important`,
        },

        '.ag-theme-alpine .ag-header-cell:hover': {
          backgroundColor: `${palette.bunker?.[100]} !important`,
        },
        '.ag-cell-label-container': {
          padding: '12px',
        },

        '.ag-body': {
          overflow: 'hidden',
        },
        '.ag-theme-alpine .ag-cell.ag-cell-first-right-pinned:not(.ag-cell-range-left):not(.ag-cell-range-single-cell)':
          {
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
          color: palette.dark?.[500],
          fontWeight: '600',
          fontSize: '16px',
          lineHeight: '24px',
        },
        '.ag-theme-alpine .ag-header-icon': {
          color: palette.gray?.[400],
        },
        '.ag-row-focus': {
          backgroundColor: `${palette.orange?.[150]} !important`,
        },
        '.ag-row-hover': {
          backgroundColor: `${palette.orange?.[150]} !important`,
        },
        '.ag-cell-focus': {
          borderColor: `${palette.orange?.[500]} !important`,
        },
        '.ag-tabs.ag-menu': {
          boxShadow: theme.boxShadow?.['64-16'],
        },
        '.ag-theme-alpine .ag-menu-option-text': {
          color: palette.gray?.[400],
        },
        '.ag-theme-alpine .ag-menu-option-active': {
          background: palette.gray?.[100],
        },
        '.ag-theme-alpine .ag-menu-separator': {
          background: palette.gray?.[200],
        },
        '.ag-row.ag-row-odd': {
          background: 'none',
        },
        ".ag-menu.ag-ltr.ag-popup-child[aria-label='SubMenu']": {
          background: palette.background?.default,
          boxShadow: theme.boxShadow?.['16-8'],
        },

        '.ag-theme-alpine .ag-paging-panel': {
          borderColor: palette.gray?.[200],
        },
        '.no-rows-container': {
          borderColor: palette.bunker?.[100],
        },

        '.ag-theme-alpine .ag-pinned-left-header': {
          borderColor: palette.gray?.[200] + ' !important',
        },
        '.ag-theme-alpine.ag-cell .ag-cell-last-left-pinned:not(.ag-cell-range-right):not(.ag-cell-range-single-cell)':
          {
            borderColor: palette.gray?.[200],
          },
        '.ag-theme-alpine.ag-cell .ag-cell-first-right-pinned:not(.ag-cell-range-left):not(.ag-cell-range-single-cell)':
          {
            borderColor: palette.gray?.[200],
          },
      }}
    />
  )
}

export default GlobalStyles
