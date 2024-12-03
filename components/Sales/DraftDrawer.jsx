import { Box, Drawer, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { useState } from 'react'
import CloseIcon from '../../src/assets/icons/CloseIcon'
import InputSearch from '../Inputs/InputSearch'
import DraftParentItemsBox from './DraftParentItemsBox'
import DraftChildDrawer from './DraftChildDrawer'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: '660px',
      borderRadius: '24px 0 0 24px',
      backgroundColor: theme.palette.background.default,
    },
  },
  drawerHeader: {
    height: '80px',
    padding: '16px 24px',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
  },
}))
function DraftDrawer({ open, setOpen }) {
  const classes = useStyles()
  const [isOpenChild, setIsOpenChild] = useState(false)

  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor='right' elevation={1} className={classes.drawer}>
      {!isOpenChild ? (
        <Box>
          <Box display={'flex'} justifyContent={'space-between'} className={classes.drawerHeader}>
            <Typography fontSize={24} lineHeight={'48px'} fontWeight={700}>
              Qoralamalar
            </Typography>
            <CloseIcon onClick={() => setOpen(false)} />
          </Box>
          <Box padding={'24px'}>
            <InputSearch fullWidth placeholder={'Qidirish: ID, mijoz, sotuvchi'} />
          </Box>
          <Box padding={'0 20px'}>
            <DraftParentItemsBox setIsOpenChild={setIsOpenChild} />
          </Box>
        </Box>
      ) : (
        <DraftChildDrawer setChildOpen={setIsOpenChild} open={isOpenChild} setOpen={setOpen} />
      )}
    </Drawer>
  )
}

export default DraftDrawer
