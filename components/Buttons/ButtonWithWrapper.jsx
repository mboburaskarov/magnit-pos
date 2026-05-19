import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  btn: {
    cursor: 'pointer',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',

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
      sx={{
        height: '40px !important',
        width: '40px !important',
        borderRadius: '8px !important',
        border: '1px solid #E5E7EB !important',
        backgroundColor: '#ffffff !important',
        display: 'flex !important',
        alignItems: 'center !important',
        justifyContent: 'center !important',
        marginRight: '0px !important',
        padding: '0px !important',
        boxSizing: 'border-box !important',
        ...prop.sx
      }}
    >
      {icon}
    </Box>
  )
}

export default ButtonWithWrapper
