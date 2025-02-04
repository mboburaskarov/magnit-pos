import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { get, size } from 'lodash'
import React from 'react'
import thousandDivider from '../../../../utils/thousandDivider'
import DefaultImgIcon from '../../../assets/icons/defaultImgIcon'
const useStyles = makeStyles((theme) => ({
  productImg: {
    width: '48px',
    height: '48px',
    borderRadius: '6px',
    marginRight: '8px',
  },
}))
function SaleChildItemsBox({ item }) {
  const classes = useStyles()

  return (
    <Box display={'flex'} mb={'10px'} height={'80px'} justifyContent={'space-between'}>
      <Box borderRadius={'16px'} p={'16px'} bgcolor={'bg.10'} mr={'8px'} display={'flex'} width={'100%'} justifyContent={'space-between'}>
        <Box display={'flex'} width={'100%'} alignItems={'center'}>
          {size(get(item, 'photos[0]', [])) <= 0 ? <DefaultImgIcon /> : <img className={classes.productImg} src={get(item, 'photos[0]')} />}
          <Box display={'flex'} ml={'10px'} flexDirection={'column'} width={'100%'}>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  wordWrap: 'break-word',
                  textOverflow: 'ellipsis',
                  '-webkit-box-orient': 'vertical',
                  '-webkit-line-clamp': '1',
                }}
                fontSize={'16px'}
                fontWeight={'600'}
                lineHeight={'24px'}
                color={'bunker.950'}
              >
                {get(item, 'name')}
              </Typography>
              <Typography fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'bunker.500'}>
                C2
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography mt={'4px'} fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'bunker.500'}>
                {get(item, 'barcode')}
              </Typography>
              <Typography whiteSpace={'pre'} mt={'4px'} fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'orange.500'}>
                {get(item, 'quantity')}пч{get(item, 'unit_quantity') > 0 ? `/${get(item, 'unit_quantity')}шт` : ''} -{' '}
                {thousandDivider(get(item, 'total_price'), 'сум')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box borderRadius={'16px'} p={'16px'} minWidth={'160px'} bgcolor={'bg.10'}>
        <Typography fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'}>
          Бонус
        </Typography>
        <Box mt={'4px'} display={'flex'} justifyContent={'space-between'} width={'100%'}>
          <Typography fontSize={'14px'} fontWeight={'500'} color={'purple.500'} lineHeight={'20px'}>
            {thousandDivider(get(item, 'bonus_percent'))} %{/* {get(item, 'discount_type') === 'percent' ? '%' : "so'm"} */}
          </Typography>
          <Typography fontSize={'14px'} fontWeight={'500'} color={'purple.500'} lineHeight={'20px'}>
            {thousandDivider(get(item, 'bonus_amount'))} so'm
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default SaleChildItemsBox
