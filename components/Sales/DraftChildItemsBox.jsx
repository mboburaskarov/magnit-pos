import { ShoppingBag } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'
import ArrowRightIcon from '../../src/assets/icons/ArrowRightIcon'
import BagOutline from '../../src/assets/icons/BagOutline'
const useStyles = makeStyles((theme) => ({
  productImg: {
    width: '48px',
    height: '48px',
    borderRadius: '6px',
    marginRight: '8px',
  },
}))
function DraftChildItemsBox({ setIsOpenChild }) {
  const classes = useStyles()
  return (
    <Box display={'flex'} height={'80px'} justifyContent={'space-between'} onClick={setIsOpenChild}>
      <Box borderRadius={'16px'} p={'16px'} bgcolor={'bg.10'} mr={'8px'} display={'flex'} width={'100%'} justifyContent={'space-between'}>
        <Box display={'flex'}>
          <img className={classes.productImg} src='/default-user-img.png' />
          <Box>
            <Typography fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'bunker.950'}>
              Azitromitsin 250 mg / 2 dona
            </Typography>
            <Typography mt={'4px'} fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'bunker.500'}>
              50609549182024
            </Typography>
          </Box>
        </Box>
        <Box display={'flex'} flexDirection={'column'} alignItems={'end'}>
          <Typography fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'bunker.500'}>
            C2
          </Typography>
          <Typography mt={'4px'} fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'orange.500'}>
            232 323 so'm
          </Typography>
        </Box>
      </Box>
      <Box borderRadius={'16px'} p={'16px'} minWidth={'160px'} bgcolor={'bg.10'}>
        <Typography fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'}>
          Sotuv bonusi
        </Typography>
        <Box mt={'4px'} display={'flex'} justifyContent={'space-between'} width={'100%'}>
          <Typography fontSize={'14px'} fontWeight={'500'} color={'purple.500'} lineHeight={'20px'}>
            2%
          </Typography>
          <Typography fontSize={'14px'} fontWeight={'500'} color={'purple.500'} lineHeight={'20px'}>
            2 323 so'm
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default DraftChildItemsBox
