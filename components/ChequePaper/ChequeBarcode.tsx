import { Box } from '@mui/material'
import Barcode from 'react-barcode'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  svg: {
    '& > svg': {
      width: '100%',
      height: '100%',
    },
  },
}))

const ChequeBarcode = ({ orderNumber }) => {
  const classes = useStyles()
  const options = {
    width: 3.8,
    height: 72,
    format: 'CODE128',
    displayValue: false,
    background: '#ffffff',
    lineColor: '#000000',
    margin: 0,
  }
  const style = {
    transformOrigin: 'left top',
    height: 72,
    width: '100%',
    marginBottom: 12,
    zIndex: 1,
  }

  return (
    <Box style={style} className={classes.svg}>
      <Barcode value={String(orderNumber)} {...options} />
    </Box>
  )
}

export default ChequeBarcode
