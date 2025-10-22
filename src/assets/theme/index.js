import typography from './typography'

export const theme = ({ mode, palette }) => {
  const fontFamily = {
    inter: '"Inter", sans-serif',
    Gilroy: 'Gilroy',
  }
  return {
    mode,
    palette: palette,
    typography: typography,
    fontFamily: fontFamily,
    boxShadow: palette.boxShadow,
    fontSize: {
      xs2: '0.625rem',
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.5rem',
      xl2: '2.25rem',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            color: 'black',
          },
        },
      },
      MuiStack: {
        defaultProps: {
          direction: 'row',
        },
      },

      MuiContainer: {
        defaultProps: {
          disableGutters: true,
          fixed: true,
        },
        styleOverrides: {
          maxWidthXl: {
            maxWidth: '1440px',
          },
          maxWidthLg: {
            maxWidth: 'calc(100vw - 96px) !important',
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: palette.black + '30',
          },
        },
      },

      MuiCircularProgress: {
        styleOverrides: {
          root: {
            color: palette.orange[500],
          },
        },
      },
      MuiLoadingButton: {
        styleOverrides: {
          root: {},
          label: {
            fontFamily: fontFamily.Gilroy,
            fontWeight: 400,
            fontSize: 18,
            lineHeight: '24px',
          },
          loading: {},
          loadingIndicator: {
            span: {
              height: '24px !important',
              width: '24px !important',
              svg: { height: '24px !important', width: '24px !important' },
            },
          },
        },
      },

      MuiButton: {
        defaultProps: {
          variant: 'contained',
          disableRipple: true,
          disableTouchRipple: true,
          disableElevation: true,
        },
        styleOverrides: {
          disableElevation: {},
          root: {
            fontFamily: fontFamily.Gilroy,
            fontSize: 16,
            fontWeight: 600,
            lineHeight: '27px',
            textTransform: 'none',
            letterSpacing: 'normal',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
            padding: '14px 20px',
            minHeight: 0,
            height: 56,
            minWidth: 0,
            outline: '0',
            border: '0',
            cursor: 'pointer',
            position: 'relative',
            '&.MuiButton-containedPrimary.Mui-disabled': {
              '& p': {
                color: `#fff !important`,
              },
            },
            '&.MuiButton-containedSecondary.Mui-disabled': {
              backgroundColor: `${palette.background.gray} !important`,
              '& p': {
                color: `${palette.bunker[300]} !important`,
              },
            },

            '&.Mui-disabled': {
              backgroundColor: `${palette.bunker[400]} !important`,
              color: `${palette.background.default} !important`,
              cursor: 'auto',
              background: palette.gray[50],
              '&:hover': {
                background: palette.gray[100],
                color: palette.gray[400],
              },
            },
          },

          containedPrimary: {
            backgroundColor: palette.orange[500],
            color: '#fff',
            '&:hover': {
              background: palette.orange[600],
            },
          },

          containedSecondary: {
            backgroundColor: `${palette.background.gray} !important`,
            color: '#000',
            '&:hover': {
              backgroundColor: `${palette.bunker[100]} !important`,
            },
            border: `2px solid ${palette.bunker[100]}`,
          },
          containedRed: {
            backgroundColor: palette.red[600],
            color: '#fff',
            '&:hover': {
              background: palette.red[700],
            },
          },

          outlinedPrimary: {
            padding: '0 16px',
            color: palette.gray[600],
            backgroundColor: palette.background.defaultStrong,
            border: `2px solid ${palette.gray[300]}`,
            '&:hover': {
              backgroundColor: palette.gray[101],
              border: `2px solid ${palette.gray[300]}`,
            },
          },

          outlinedSecondary: {
            backgroundColor: palette.orange[500],
            color: '#fff',
            '&:hover': {
              background: palette.orange[601],
            },
          },

          sizeLarge: {
            height: 64,
          },
          sizeSmall: {
            height: 48,
          },

          startIcon: {
            paddingLeft: 4,
            display: 'flex',
            justifyContent: 'center',
          },

          endIcon: {},
        },
      },
      MuiIconButton: {
        defaultProps: {
          disableRipple: true,
          disableTouchRipple: true,
          color: 'inherit',
        },
        styleOverrides: {
          root: {
            width: 48,
            height: 48,
            padding: '16px',
            '&:hover': {
              backgroundColor: 'transparent',
            },
            svg: {
              fill: 'transparent',
            },
          },
          colorInherit: {
            color: palette.orange[500],
            backgroundColor: palette.gray[100],
            '&:hover': {
              background: palette.gray[101],
            },
          },
          colorPrimary: {
            backgroundColor: palette.orange[500],
            svg: {
              fill: 'white',
            },
            '&:hover': {
              background: palette.orange[601],
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 48,
            height: 32,
            padding: 0,
            '& .MuiSwitch-thumb': {
              boxShadow: '0',
              backgroundColor: palette.background.palette,
              color: palette.common.white,
            },
          },
          switchBase: {
            padding: 0,
            transform: 'translateX(4px)',
          },

          thumb: {
            // marginTop: 4,
            width: 24,
            height: 24,
            boxShadow: 'none',
            borderRadius: 32,
          },
          track: {
            borderRadius: 32,
            backgroundColor: palette.gray[300],
            opacity: '1 !important',
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: palette.black,
          },
          defaultProps: {
            underline: 'none',
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          label: {
            fontWeight: '400 !important',
            fontSize: 18,
            lineHeight: '24px',
            fontFamily: fontFamily.Gilroy,
            marginTop: 3,
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          variant: 'body1',
        },
        styleOverrides: {
          root: {
            fontSize: 18,
            fontWeight: 400,
            lineHeight: '24px',
            color: palette.black,
          },
          h1: {
            fontFamily: fontFamily.Gilroy,
            color: palette.black,
          },
          h2: {
            fontSize: 24,
            lineHeight: '28px',
            fontFamily: fontFamily.Gilroy,
            color: palette.black,
          },
          h4: {
            display: 'inline-flex',
            alignItems: 'center',
            color: palette.black,
          },
        },
      },
      MuiAccordion: {
        defaultProps: {
          square: true,
          disableGutters: true,
        },
        styleOverrides: {
          root: {
            '&:before': {
              display: 'none',
            },
            borderRadius: 16,
            boxShadow: 'none',
          },
          rounded: {
            borderRadius: 16,
            '&:last-child': {
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            },
            '&:first-child': {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            padding: 0,
          },
          content: {
            height: 56,
            margin: 0,
            alignItems: 'center',
          },
          expandIconWrapper: {
            padding: '0 16px',
          },
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: {
            padding: '24px 0',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            padding: 16,
            backgroundColor: palette.bunker[300],
            borderRadius: 16,
            fontSize: 16,
            lineHeight: '19px',
            fontWeight: 600,
            fontFamily: fontFamily.Gilroy,
            textAlign: 'center',
          },
          arrow: {
            color: palette.bunker[300],
            '&:before': {
              borderRadius: '0 0 2px 0',
            },
          },
          tooltipPlacementTop: {
            '@media(min-width: 600px)': {
              margin: '8px 0',
            },
          },
        },
      },
      MuiToolbar: {
        defaultProps: { disableGutters: true },
        styleOverrides: {
          regular: {
            '@media (min-width: 600px)': {
              minHeight: '56px',
            },
          },
        },
      },
      MuiCheckbox: {
        defaultProps: {
          color: 'primary',
          disableRipple: true,
          disableTouchRipple: true,
        },
        styleOverrides: {
          root: {
            color: '#fff',
            height: '20px',
            width: '20px',
            '& .MuiSvgIcon-root': {
              fontSize: 24,
              fill: palette.orange[500],
            },
          },
          colorPrimary: {
            '&:hover, &.Mui-checked:hover': {
              backgroundColor: 'inherit !important',
            },
          },
        },
      },
      MuiListItem: {
        styleOverrides: {},
      },
      MuiTab: {
        defaultProps: { disableRipple: true, disableTouchRipple: true },
      },
      MuiFilledInput: {
        defaultProps: { disableUnderline: true },
        styleOverrides: {
          root: {
            width: '445px',
            borderRadius: 40,
            backgroundColor: palette.background.paper,
            '&:hover': {
              backgroundColor: palette.background.paper,
            },
            'label + &': {
              marginTop: '0px',
            },

            '&.Mui-focused': {
              backgroundColor: palette.background.paper,
            },
          },
          input: {
            '&:-webkit-autofill': {
              color: 'red',
              paddingTop: '11px !important',
              paddingRight: 12,
              paddingBottom: '1px !important',
              border: 'none !important',
              paddingLeft: 16,
              backgroundColor: 'transparent !important',
              WebkitBoxShadow: '0 0 0 1000px white inset !important',
              ' -webkit-text-fill-color': 'inherit !important' /* Inherit the text color */,
              fontSize: 'inherit !important' /* Maintain font size */,
              lineHeight: 'inherit !important' /* Prevent height issues */,
              borderRadius: 'inherit !important' /* Keep border radius consistent */,
            },
          },
        },
      },
      MuiFormControl: {
        defaultProps: { autoComplete: 'off' },
        styleOverrides: {
          root: {
            backgroundColor: `${palette.white} !important`,
            margin: '0 !important',
          },
        },
      },
      MuiTextField: {
        defaultProps: { autoComplete: 'off' },
        styleOverrides: {
          root: {
            color: 'secondry',
            backgroundColor: '#fff',
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            fontSize: 12,
            left: '4px !important',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorDefault: {
            backgroundColor: '#4B5B7A',
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            margin: '0 auto',
            fontSize: '18px',
          },
          fontSizeInherit: {
            fontSize: '17px',
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 50,
            transition: '0.3s',
            color: palette.gray[600],
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&.Mui-disabled.MuiOutlinedInput-root': {
              backgroundColor: palette.background.gray,
            },
            paddingRight: '0px !important',
          },
          input: {
            padding: '4px 14px',
          },
          notchedOutline: {
            borderColor: palette.gray[300],
            borderWidth: 0,
          },
          multiline: {
            minHeight: 120,
            padding: 20,
            alignItems: 'start',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: palette.black,
            fontSize: 18,
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: 'normal',
            border: '2px solid transparent',
            borderColor: palette.bunker[100],
            backgroundColor: palette.white,
            height: 48,
            '&.Mui-focused': {
              boxSizing: 'border-box',
              border: `1px solid ${palette.orange[500]} !important`,
            },
            '&.Mui-error:not(.Mui-focused)': {
              border: '2px solid red',
            },
          },
          input: {
            '&::placeholder': {
              color: palette.bunker[400],
              opacity: 1,
              fontWeight: '500 !important',
            },
            '&:-webkit-autofill': {
              color: 'red',
              paddingTop: '10px !important',
              fontWeight: '400 !important',

              paddingBottom: '9px !important',
              border: 'none !important',
              backgroundColor: 'transparent !important',
              WebkitBoxShadow: '0 0 0 1000px white inset !important',
              ' -webkit-text-fill-color': 'inherit !important' /* Inherit the text color */,
              fontSize: '16px !important' /* Maintain font size */,
              lineHeight: 'inherit !important' /* Prevent height issues */,
              borderRadius: 'inherit !important' /* Keep border radius consistent */,
            },
          },
        },
      },
      MuiTreeItem: {
        styleOverrides: {
          root: {
            width: '100%',
            background: palette.gray[50],
            borderRadius: 16,
            marginTop: 8,
          },
          content: {
            padding: '0 16px',
            color: palette.gray[500],
            width: '100%',
            minHeight: 48,
            '&.Mui-selected': {
              backgroundColor: 'transparent',
              '&.Mui-focused': {
                backgroundColor: 'transparent',
              },
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'transparent',
            },
            '&.Mui-focused': {
              backgroundColor: 'transparent',
            },
            ':hover': {
              backgroundColor: 'transparent',
            },
            ':focus': {
              backgroundColor: 'transparent',
            },
          },
        },
      },
      MuiTreeView: {
        styleOverrides: {
          root: {
            minHeight: 56,
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          endAdornment: {
            right: '16px !important',
          },
          tag: {
            margin: '0 4px',
          },
          input: {
            cursor: 'pointer',
          },
          inputRoot: {
            cursor: 'pointer',
          },
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          root: {
            marginTop: '0 !important',
            color: palette.gray[600],
          },
          positionEnd: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 56,
            height: '100%',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: palette.gray[100],
            height: 40,
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            lineHeight: '19px',
            color: palette.gray[600],
            fontFamily: fontFamily.Gilroy,
          },
          deleteIcon: {
            width: 24,
            height: 24,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: palette.background.default,
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            zIndex: 11,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            position: 'unset',
            backgroundColor: palette.background.default,
            zIndex: 11,
            '::-webkit-scrollbar-thumb': {
              width: '0 !important',
            },
          },
          container: {
            position: 'relative',
            backgroundColor: palette.black + '30',
            zIndex: 10,
          },
          h2: {
            display: 'flex',
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            height: 56,
            borderRadius: 16,
          },
        },
      },
    },
  }
}
