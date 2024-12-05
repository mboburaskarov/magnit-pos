import { Box, Button, Drawer, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { useState } from 'react'
import CloseIcon from '../../../assets/icons/CloseIcon'
import WaitingCashAmoutIcon from '../../../assets/icons/WaitingCashAmoutIcon'
import InComeCashIcon from '../../../assets/icons/InComeCashIcon'
import ExpenseCashIcon from '../../../assets/icons/ExpenseCashIcon'

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
  tbBox: {
    borderRadius: '16px',
    overflow: 'hidden',
    border: `1px solid ${theme.palette.bunker[100]}`,
    marginBottom: '24px',
  },
  tbHeader: {
    backgroundColor: theme.palette.bg[10],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    height: '56px',
    '& svg': {
      width: '32px',
      height: '32px',
    },
  },
  tbHeaderTitle: {
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '32px',
    color: theme.palette.black,
    marginLeft: '8px',
  },
  tbHeaderAmount: {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '24px',
    color: theme.palette.bunker[950],
  },
  tbHeaderBody: {
    display: 'flex',
    flexDirection: 'column',
  },
  tbHeaderColumn: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 12px',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
    '&:last-child': {
      border: 'none',
    },
  },
  tbHeaderColumnTitle: {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '24px',
    color: theme.palette.bunker[950],
  },
  tbHeaderColumnAmount: {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '24px',
    color: theme.palette.bunker[950],
  },
}))
function CashTypeDrawer({ open, setOpen }) {
  const classes = useStyles()
  const [draftfilter, setDraftFilter] = useState(false)

  const [isOpenChild, setIsOpenChild] = useState(false)

  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor='right' elevation={1} className={classes.drawer}>
      <Box>
        <Box display={'flex'} justifyContent={'space-between'} className={classes.drawerHeader}>
          <Typography fontSize={24} lineHeight={'48px'} fontWeight={700}>
            Naqt
          </Typography>
          <CloseIcon onClick={() => setOpen(false)} />
        </Box>
        <Box display={'flex'} padding={'24px'} flexDirection={'column'}>
          <Box className={classes.tbBox}>
            <Box className={classes.tbHeader}>
              <Box display={'flex'}>
                <WaitingCashAmoutIcon />
                <Typography className={classes.tbHeaderTitle}>Kutilgan</Typography>
              </Box>
              <Typography className={classes.tbHeaderAmount}>6 666 666 UZS</Typography>
            </Box>
          </Box>
          {/*  */}
          <Box className={classes.tbBox}>
            <Box className={classes.tbHeader}>
              <Box display={'flex'}>
                <InComeCashIcon />
                <Typography className={classes.tbHeaderTitle}>Kassadan oldim</Typography>
              </Box>
              <Typography className={classes.tbHeaderAmount}>6 666 666 UZS</Typography>
            </Box>
            <Box className={classes.tbHeaderBody}>
              <Box className={classes.tbHeaderColumn}>
                <Typography className={classes.tbHeaderColumnTitle}>Sotuvlar</Typography>
                <Typography className={classes.tbHeaderColumnAmount}>3 333 333 UZS</Typography>
              </Box>
              <Box className={classes.tbHeaderColumn}>
                <Typography className={classes.tbHeaderColumnTitle}>Sotuvlar</Typography>
                <Typography className={classes.tbHeaderColumnAmount}>3 333 333 UZS</Typography>
              </Box>
            </Box>
          </Box>
          {/*  */}
          <Box className={classes.tbBox}>
            <Box className={classes.tbHeader}>
              <Box display={'flex'}>
                <ExpenseCashIcon />
                <Typography className={classes.tbHeaderTitle}>Kassani tark etadi</Typography>
              </Box>
              <Typography className={classes.tbHeaderAmount}>6 666 666 UZS</Typography>
            </Box>
            <Box className={classes.tbHeaderBody}>
              <Box className={classes.tbHeaderColumn}>
                <Typography className={classes.tbHeaderColumnTitle}>Sotuvlar</Typography>
                <Typography className={classes.tbHeaderColumnAmount}>3 333 333 UZS</Typography>
              </Box>
              <Box className={classes.tbHeaderColumn}>
                <Typography className={classes.tbHeaderColumnTitle}>Sotuvlar</Typography>
                <Typography className={classes.tbHeaderColumnAmount}>3 333 333 UZS</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}

export default CashTypeDrawer
