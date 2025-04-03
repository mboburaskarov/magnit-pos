import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'
const useStyles = makeStyles((theme) => ({
  btn: {
    cursor: 'pointer',
    backgroundColor: theme.palette.background.gray,

    '&:hover': {
      background: `${theme.palette.bunker[100]} !important`,
    },
  },
}))
function ButtonWithWrapper({ icon, ...prop }) {
  const classes = useStyles()

  return (
    <Box
      {...prop}
      className={classes.btn}
      padding={'12px'}
      borderRadius={'50%'}
      border={'1px solid #ECEDF2'}
      mr={'16px'}
      display={'flex'}
      alignItems={'center'}
    >
      {icon}
    </Box>
  )
}

export default ButtonWithWrapper
