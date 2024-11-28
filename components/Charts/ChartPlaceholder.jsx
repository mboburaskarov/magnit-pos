import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  box: {
    border: '2px dashed #CFCFCF',
    borderRadius: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: theme.palette.gray[400],
    fontSize: 16,
    fontWeight: 600,
    width: 230,
    textAlign: 'center',
  },
  margin: {
    margin: '0 16px 0 24px',
  },
}))

const ChartPlaceholder = ({ textstyle, text, height = 311, noMargin }) => {
  const classes = useStyles()
  return (
    <Box className={`${classes.box} ${!noMargin && classes.margin}`} style={{ height }}>
      <Typography style={textstyle || {}} className={classes.text}>
        {text}
      </Typography>
    </Box>
  )
}

export default ChartPlaceholder
