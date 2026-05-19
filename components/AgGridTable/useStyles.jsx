import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'relative',
    // overflow: 'hidden',
    '& > div:first-of-type': {
      height: 'unset !important',
    },
  },
  cell: {
    height: '100%',
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: theme.palette.gray[600],
    padding: '15px',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    borderRadius: '8px',
  },
  noRows: {
    maxWidth: '70%',
    height: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    '& h3': {
      textAlign: 'center',
      fontWeight: '600',
      color: theme.palette.gray[600],
      fontFamily: `"Gilroy", sans-serif`,
      fontSize: 24,
      lineHeight: '28px',
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    '& p': {
      color: theme.palette.gray[300],
      marginTop: 8,
    },
  },

  pagination: {
    maxWidth: '50%',
    display: 'flex',
    alignItems: 'center',
  },
  tableSettingsButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 10,
    right: 0,
    zIndex: 100,
    '.column-group-header &': {
      top: 6,
    },
  },
}))

export default useStyles
