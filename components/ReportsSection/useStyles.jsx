import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    borderRadius: 32,
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.boxShadow['16-8'],
  },
  content: {
    // paddingBottom: 16,
  },
  chartContainer: {
    width: '100%',
    height: '100%',
    fontFamily: theme.fontFamily.inter,
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '17px',
    color: theme.palette.gray[600],
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: theme.fontFamily.gilroyBold,
    color: theme.palette.gray[400],
    '& > span': {
      display: 'inline-flex',
      marginBottom: 12,
    },
  },
  shopBadge: {
    width: 16,
    height: 16,
    borderRadius: '50%',
  },
  shopPrice: {
    color: theme.palette.blue[500],
  },
  alignStart: {
    justifyContent: 'flex-start',
  },
  filter_box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    '& > div:nth-child(1)': {
      display: 'flex',
    },
  },
  removeDates: {
    background: 'transparent',
    border: 0,
    marginLeft: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  dateBtn: {
    '&  > p': {
      fontWeight: 600,
      textAlign: 'left',
      color: theme.palette.gray[400],
      lineHeight: '19px',
      fontSize: 16,
    },
    '& > span': {
      lineHeight: '19px',
      color: theme.palette.gray[600],
      fontWeight: 600,
    },
  },
  report_box: {
    display: 'flex',
    borderRadius: 32,
    padding: 32,
    // height: 256,
    boxShadow: theme.boxShadow['16-8'],
    flexDirection: 'column',
    '& > h4': {
      color: theme.palette.black,
      fontFamily: `'Gilroy-Bold', sans-serif`,
      fontSize: 24,
      lineHeight: '28px',
      margin: `4px 0 24px`,
    },
    '& > a': {
      color: theme.palette.blue[500],
      fontWeight: 600,
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
    },
    '& > a svg': {
      marginLeft: 4,
    },
    '& > div:nth-child(1)': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: theme.palette.gray[400],
    },
    '& > div:nth-child(1) > span': {
      display: 'block',
      height: 16,
      width: 16,
      borderRadius: '50%',
      marginRight: 8,
      background: ({ color }) => color,
    },
  },
  report_box_empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    padding: 32,
    width: 464,
    height: 256,
    boxShadow: theme.boxShadow['16-8'],
    flexDirection: 'column',
    '& > h4': {
      fontFamily: `'Gilroy-Bold', sans-serif`,
      fontSize: 26,
      lineHeight: '28px',
      margin: `4px 0 14px`,
    },
    '& > p': {
      textAlign: 'center',
    },
  },
  section_container: {
    '& > h2': {
      fontFamily: `"Gilroy-Bold", sans-serif`,
      fontSize: 36,
      lineHeight: '42px',
      color: theme.palette.gray[400],
      marginBottom: 32,
    },
  },
}))
export default useStyles
