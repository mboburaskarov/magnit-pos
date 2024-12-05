import { Box, Button, Drawer, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { useState } from 'react'
import CloseIcon from '../../src/assets/icons/CloseIcon'
import InputSearch from '../Inputs/InputSearch'
import DraftParentItemsBox from './DraftParentItemsBox'
import LeftArrowIcon from '../../src/assets/icons/LeftArrow'
import DraftChildItemsBox from './DraftChildItemsBox'
import DeleteIcon from '../../src/assets/icons/DeleteIcon'
import MarkRectangleIcon from '../../src/assets/icons/MarkRectangleIcon'
import WithdrawIcon from '../../src/assets/icons/WithdrawIcon'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: '660px',
      borderRadius: '24px 0 0 24px',
      backgroundColor: theme.palette.background.default,
    },
  },
  drawerHeader: {
    height: '88px',
    padding: '16px 24px',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
  },
  rightArrowIcon: {
    backgroundColor: theme.palette.bg[10],
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    '& svg': {
      backgroundColor: theme.palette.bg[10],
    },
  },
  usrImg: {
    width: '24px',
    borderRadius: '50%',
    margin: '0 4px',
  },
}))
function DraftChildDrawer({ open, setChildOpen, setOpen }) {
  const classes = useStyles()
  console.log(open)

  return (
    <Box className={classes.drawer}>
      <Box display={'flex'} justifyContent={'space-between'} className={classes.drawerHeader}>
        <Box display={'flex'} alignItems={'center'}>
          <Box onClick={() => setChildOpen(false)} className={classes.rightArrowIcon}>
            <LeftArrowIcon />
          </Box>
          <Box ml={'16px'}>
            <Typography fontSize={24} lineHeight={'32px'} fontWeight={700}>
              Qoralama #343434
            </Typography>
            <Typography fontSize={16} lineHeight={'24px'} color={'orange.500'} fontWeight={600}>
              2332 323 so'm
            </Typography>
          </Box>
        </Box>

        <CloseIcon
          onClick={() => {
            setOpen(false), setChildOpen(false)
          }}
        />
      </Box>

      <Box padding={'24px 20px 0'}>
        <Box alignItems={'center'} height={'32px'} display={'flex'} justifyContent={'space-between'}>
          <Typography fontSize={20} lineHeight={'32px'} fontWeight={600}>
            Savatcha
          </Typography>
          <Box display={'flex'} alignItems={'center'}>
            <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
              Sotuvchi:
            </Typography>
            <img className={classes.usrImg} src='/default-user-img.png' />

            <Typography fontSize={16} lineHeight={'24px'} fontWeight={600}>
              Usmon
            </Typography>
          </Box>
        </Box>
        <Box padding={'16px 0'}>
          <DraftChildItemsBox />
        </Box>
        <Box p={'24px 0'} mt={'8px'} borderTop={'1px solid'} borderColor={'bunker.100'}>
          <Typography mb={'16px'} fontSize={20} lineHeight={'32px'} fontWeight={600}>
            Tafsilotlar
          </Typography>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Box width={'100%'} bgcolor={'bg.10'} mr={'8px'} borderRadius={'16px'} padding={'16px'}>
              <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                Yaratilgan sana
              </Typography>
              <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                24.11.2024 | 10:45:30
              </Typography>
            </Box>
            <Box width={'100%'} bgcolor={'bg.10'} borderRadius={'16px'} padding={'16px'}>
              <Typography fontSize={14} lineHeight={'20px'} fontWeight={500} color={'bunker.500'}>
                Do’kon
              </Typography>
              <Typography fontSize={16} mt={'4px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
                Akmal Pharm Next Mall
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box height={'calc(100vh - 550px)'} />
        <Box
          sx={{
            '& .MuiButtonBase-root': {
              height: 48,
            },
          }}
          columnGap={2}
          display='flex'
          width='100%'
          mt={4}
        >
          <Button fullWidth color='secondary' variant='contained'>
            <WithdrawIcon />

            <Typography fontSize={16} ml={'12px'} color={'bunker.950'} lineHeight={'24px'} fontWeight={600}>
              Chop etish
            </Typography>
          </Button>
          <Button fullWidth color='secondary' variant='contained'>
            <DeleteIcon width='24px' />

            <Typography fontSize={16} ml={'12px'} color={'red.500'} lineHeight={'24px'} fontWeight={600}>
              O'chirish
            </Typography>
          </Button>
          <Button fullWidth variant='contained' type='submit'>
            <MarkRectangleIcon />
            <Typography fontSize={16} ml={'12px'} color={'white'} lineHeight={'24px'} fontWeight={600}>
              Yakunlash
            </Typography>
          </Button>
        </Box>
        {/* <DraftParentItemsBox />
        <DraftParentItemsBox />
        <DraftParentItemsBox />
        <DraftParentItemsBox /> */}
      </Box>
    </Box>
  )
}

export default DraftChildDrawer
