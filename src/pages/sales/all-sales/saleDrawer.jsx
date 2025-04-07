import { Box, Drawer } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import SaleChildDrawer from './saleChildDrawer'

const useStyles = makeStyles((theme) => ({
  drawer: {
    overflow: 'hidden',
    position: 'relative !important',

    '& .MuiDrawer-paper': {
      width: '600px',
      height: '100vh',

      borderRadius: '24px 0 0 24px',
      boxShadow: '4px -5px 20px 0px #ccc !important',

      backgroundColor: theme.palette.background.default,
    },
  },
  drawerHeader: {
    height: '80px',
    padding: '16px 10px',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
  },
}))
function SaleDrawer({ open, setOpen, ids }) {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <Drawer
      ModalProps={{
        hideBackdrop: true, // Optional: Removes the overlay
        keepMounted: true, // Keeps drawer in the DOM for better performance
        'aria-hidden': false, // ✅ Prevents MUI from blocking other elements
        disableScrollLock: true, // Prevents MUI from adding `overflow: hidden` to `body`
      }}
      sx={{ height: '100vh !important' }}
      open={open}
      onClose={() => setOpen(false)}
      anchor='right'
      elevation={1}
      className={classes.drawer}
    >
      <SaleChildDrawer ids={ids} open={open} setOpen={setOpen} />
      <Box
        sx={{
          bottom: 10,
          m: '10px 10px',
          '& .MuiButtonBase-root': {
            height: 48,
          },
        }}
      >
        {/* <Button fullWidth color='secondary' variant='contained'>
          <WithdrawIcon />
          <Typography fontSize={16} ml={'12px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
            {t('print')}
          </Typography>
        </Button> */}
      </Box>
    </Drawer>
  )
}

export default SaleDrawer
