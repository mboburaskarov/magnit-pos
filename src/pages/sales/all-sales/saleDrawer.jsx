import { Box, Button, Drawer } from '@mui/material';
import CheckAccess from '@components/CheckAccess';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
import { useRef } from 'react';

import SaleChildDrawer from './saleChildDrawer';


const useStyles = makeStyles((theme) => ({
  drawer: {
    overflow: 'hidden',
    left: 'auto !important',
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
  const childRef = useRef()

  const printNoProductCheque = () => {
    childRef.current.printChildCheque()
  }

  return (
    <Drawer
      ModalProps={{
        hideBackdrop: true,
        keepMounted: true,
        'aria-hidden': false,
        disableScrollLock: true,
      }}
      sx={{ height: '100vh !important' }}
      open={open}
      onClose={() => setOpen(false)}
      anchor='right'
      elevation={1}
      className={classes.drawer}
    >
      <SaleChildDrawer childRef={childRef} ids={ids} open={open} setOpen={setOpen} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: '20px',
        }}
      >
        <CheckAccess id='can-reprint'>
          <Button sx={{ minHeight: '56px', flex: '1', ml: '20px' }} onClick={() => printNoProductCheque()}>
            Повторный чек
          </Button>
        </CheckAccess>
      </Box>
    </Drawer>
  )
}

export default SaleDrawer
