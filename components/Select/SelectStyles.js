import { makeStyles } from '@mui/styles'
import { useTheme } from '@mui/material'
import paletteDark from '../../src/assets/theme/paletteDark'
import paletteLight from '../../src/assets/theme/paletteLight'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  label: {
    marginBottom: 16,
  },
  none: {
    marginBottom: 0,
  },
  required: {
    '&::after': {
      content: '" *"',
      color: theme.palette.red[500],
    },
  },
}))
export const generateCustomStyles = (props = {}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme()
  const palette = theme.mode === 'dark' ? paletteDark : paletteLight
  const {
    withAllSelect,
    minWidth,
    white,
    borderNone = false,
    borderRadius,
    error,
    maxOptionMenuHeight,
    dashed,
    inicatoorRight = false,
    solidBorder,
    mini,
    placeholderWrap = true,
  } = props

  return {
    container: (provided) => ({
      ...provided,
      width: '100%',
    }),
    valueContainer: (provided) => ({
      ...provided,
      width: '100%',
      minHeight: mini ? 40 : 46,
      padding: 1,
      // backgroundColor: 'inherit',
      borderRadius: '40px',
    }),
    control: (provided, state) => ({
      borderRadius: borderRadius || '40px',
      transition: '0.3s',
      minWidth: minWidth || 296,
      width: '100%',
      display: 'flex',
      minHeight: mini ? 40 : 48,
      fontWeight: 600,
      backgroundColor: white ? palette.background.default : palette.gray[50],
      '&:hover': {
        backgroundColor: white ? palette.background.default : palette.gray[101],
      },
      boxShadow: state.isFocused
        ? `0 0 0 2px ${palette.orange[500]}`
        : error
        ? `0 0 0 2px red`
        : `0 0 0 ${solidBorder ? 1 : 0}px ${dashed ? 'transparent' : palette.gray[300]}`,
      border: dashed ? `1px dashed ${palette.gray[300]}` : `2px solid ${palette.bunker[100]}`,
      border: borderNone ? 'none' : `2px solid ${palette.bunker[100]}`,
      fontFamily: 'Gilroy',
      cursor: state.isMulti ? 'text' : 'pointer',
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: '4px 16px',
      fontSize: '18px !important',
      fontWeight: 600,
      fontFamily: 'Gilroy',
      color: `${palette.gray[600]} !important`,
      '& input': {
        font: 'inherit',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      width: '100%',
      paddingLeft: 16,
      fontSize: 16,
      lineHeight: '19px',
      fontWeight: 600,
      color: palette.gray[400],
      fontFamily: 'Gilroy',
      whiteSpace: placeholderWrap ? 'wrap' : 'noWrap',
    }),
    singleValue: (provided) => ({
      ...provided,
      // paddingLeft: 16,
      paddingLeft: 8,
      fontSize: 17,
      // fontSize: 20,
      fontWeight: 500,
      fontFamily: 'Gilroy',
      color: palette.dark[500],
      alignItems: 'center',
      lineHeight: '28px',
    }),
    multiValue: (provided) => ({
      ...provided,
      margin: 4,
      fontSize: 16,
      lineHeight: '19px',
      fontWeight: 600,
      color: palette.gray[600],
      height: 40,
      borderRadius: 12,
      backgroundColor: white ? palette.gray[100] : palette.background.default,
      fontFamily: 'Gilroy',
      cursor: 'pointer',
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      minWidth: 20,
      display: 'flex',
      alignItems: 'center',
      color: palette.gray[600],
      fontSize: 16,
      padding: state?.isDisabled || state?.data?.isFixed ? '0 8px' : '0',
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: 0,
    }),
    multiValueRemove: (base, state) => ({
      ...base,
      cursor: 'pointer',
      borderBottomRightRadius: 16,
      borderTopRightRadius: 16,
      display: state?.isDisabled || state?.data?.isFixed ? 'none' : 'flex',
      '&:hover': {
        backgroundColor: white ? palette.gray[100] : palette.white,
      },
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      display: state?.isDisabled ? 'none' : 'flex',
      // backgroundColor: 'inherit',
      borderTopRightRadius: '50px',

      borderBottomRightRadius: '50px',
      '& > div:nth-last-of-type(1)': {
        display: state.isMulti ? 'none !important' : 'flex',
      },
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
    indicatorContainer: (provided) => ({
      ...provided,
      padding: '0 8px',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: palette.dark[500],
      padding: '0px',
      paddingRight: inicatoorRight ? '4px' : '12px',
      '&:hover': {
        color: palette.gray[400],
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 16,
      backgroundColor: palette.background.default,
      border: 'none',
      boxShadow: theme.boxShadow['16-8'],
      overflow: 'hidden',
      zIndex: 100,
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: maxOptionMenuHeight || 300,
      padding: 0,
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: palette.gray[200],
        outline: `1px solid ${palette.gray[200]}`,
      },
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: 16,
      lineHeight: '19px',
      fontWeight: 600,
      fontFamily: 'Gilroy',
      padding: 16,
    }),
    option: (base, state) => ({
      ...base,
      display: 'inline-flex',
      alignItems: 'center',
      height: mini ? 40 : 48,
      padding: '0 16px',
      fontSize: 16,
      lineHeight: '19px',
      fontWeight: 600,
      fontFamily: 'Gilroy',
      color: palette.gray[600],
      cursor: 'pointer',
      backgroundColor: state.isFocused ? palette.gray[101] : state.isFocused ? palette.orange[50] : 'transparent',
      '&:hover': {
        backgroundColor: palette.gray[101],
      },
      '&:first-child': {
        borderBottom: withAllSelect && `2px dashed ${palette.gray[200]}`,
      },
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  }
}
export default useStyles
