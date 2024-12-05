import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'sticky',
    top: 112,
  },
  noSticky: {
    position: 'static',
  },
  inner: {
    position: 'relative',
    padding: '0',
    background: 'white',
    width: '320px',
    '@media print': {
      width: '100%',
    },
    boxShadow: theme.boxShadow['32-12'],
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: '-10px',
      width: '100%',
      height: '10px',
      background:
        'linear-gradient( 45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667% ), linear-gradient( -45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667% )',
      backgroundSize: '20px 40px',
    },
    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      bottom: '-10px',
      width: '100%',
      height: '10px',
      transform: 'rotate(180deg)',
      background:
        'linear-gradient( 45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667% ), linear-gradient( -45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667% )',
      backgroundSize: '20px 40px',
    },
  },
  logo: {
    background: theme.palette.gray[100],
    borderRadius: 16,
    fontWeight: 600,
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 96,
    color: theme.palette.gray[400],
    '& img': {
      maxWidth: '100%',
      maxHeight: 96,
    },
  },
  border: {
    height: 1,
    borderRadius: 8,
    margin: '12px 0',
    background: '#6F6F6F',
    '@media print': {
      height: 1,
      background: '#000',
    },
  },
  bold: {
    color: 'black',
    fontWeight: 'bold',
    '@media print': {
      color: 'black',
    },
  },
  value: {
    color: 'black',
  },
  italic: {
    fontSize: '12px',
    fontStyle: 'italic',
    fontWeight: 'normal',
    color: 'black',
  },
  dashedRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    '& p': {
      marginBottom: '0 !important',
    },
    '& p:nth-of-type(2)': {
      fontWeight: 600,
    },
    '& div': {
      flexGrow: '1',
      height: 2,
      border: `1px dashed #6F6F6F`,
      margin: '0 8px',
      '@media print': {
        border: `1px dashed black`, // theme.palette.gray[400]
      },
    },
  },
  thank: {
    margin: 0,
    textAlign: 'center',
    '@media print': {
      color: 'black',
    },
  },
  lowerBlockItem: {
    // display: 'flex',
    // alignItems: 'center',
    // flexWrap: 'wrap',
    marginRight: '10px',
    marginBottom: 8,
    '& svg': {
      marginRight: '3px',
    },
    display: 'inline-block',
  },
  discount: {
    // color: `${theme.palette.red[500]} !important`,

    fontWeight: 500,
  },
  crossed: {
    textDecoration: 'line-through',
  },
  content: {
    '& p': {
      marginBottom: 8,
      fontSize: 12,
      lineHeight: '15px',
      color: 'black',
      fontWeight: 500,
      '@media print': {
        fontSize: 14,
        color: 'black',
        fontWeight: 400,
        lineHeight: '20px',
      },
    },
  },
  canvasContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    background: '#F5F5F5',
    width: '100%',
    maxHeight: 96,
    borderRadius: 16,
    overflow: `hidden`,
    '& .konvajs-content': {
      zIndex: 2,
    },
  },
  fiscalTitle: {
    fontWeight: 600,
    color: 'black',
    marginBottom: 10,
  },
  socialContainer: {
    display: 'block',
  },
  socialIcon: {
    width: 18,
    height: 18,
  },
  qrCode: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '16px',
  },
}))
export default useStyles
