import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { get, size } from 'lodash'
import React from 'react'
import thousandDivider from '../../../../utils/thousandDivider'
import DefaultImgIcon from '../../../assets/icons/defaultImgIcon'
const useStyles = makeStyles((theme) => ({
  productImg: {
    width: '75px',
    height: '75px',
    borderRadius: '6px',
    flexShrink: 0,
    objectFit: 'cover',
    marginRight: '8px',
  },
}))
function SaleChildItemsBox({ item }) {
  const classes = useStyles()

  return (
    <Box display={'flex'} mb={'10px'} height={'auto'} justifyContent={'space-between'}>
      <Box borderRadius={'16px'} p={'16px'} bgcolor={'bg.10'} display={'flex'} flexDirection={'column'} width={'100%'} justifyContent={'space-between'}>
        <Box borderRadius={'16px'} bgcolor={'bg.10'} display={'flex'} width={'100%'} justifyContent={'space-between'}>
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
                  {get(item, 'quantity')}
                  {get(item, 'short_name')}
                  {get(item, 'unit_quantity') > 0 ? `/${get(item, 'unit_quantity')}шт` : ''}
                </Typography>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography mt={'4px'} fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'bunker.500'}>
                  {get(item, 'barcode')}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'end',
                  }}
                >
                  {get(item, 'total_discount') > 0 && (
                    <Typography
                      whiteSpace={'pre'}
                      sx={{ textDecoration: 'line-through' }}
                      mt={'4px'}
                      fontSize={'14px'}
                      fontWeight={'600'}
                      lineHeight={'24px'}
                      color={'bunker.500'}
                    >
                      {thousandDivider(get(item, 'total_price'), 'сум')}
                    </Typography>
                  )}
                  <Typography whiteSpace={'pre'} fontSize={'16px'} fontWeight={'600'} lineHeight={'20px'} color={'orange.500'}>
                    {get(item, 'total_discount') > 0 ? thousandDivider(get(item, 'total_discount'), 'сум') : thousandDivider(get(item, 'total_price'), 'сум')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            mt: '10px',
            pt: '10px',
            borderTop: '1px dashed',
            display: 'flex',
            justifyContent: 'space-between',
            borderColor: 'bunker.400',
          }}
        >
          <Typography display={'flex'} alignItems={'center'} color={'bunker.400'} fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'}>
            Количество маркировок:
            <Typography whiteSpace={'pre'} ml={'5px'} mt={'2px'} fontSize={'16px'} fontWeight={'600'} lineHeight={'20px'} color={'orange.500'}>
              {thousandDivider(get(item, 'bonus_amount'))} so'm
            </Typography>
          </Typography>
          <Typography display={'flex'} alignItems={'center'} color={'bunker.400'} fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'}>
            Бонус:
            <Typography whiteSpace={'pre'} ml={'5px'} mt={'2px'} fontSize={'16px'} fontWeight={'600'} lineHeight={'20px'} color={'orange.500'}>
              {thousandDivider(get(item, 'bonus_amount'))} so'm
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default SaleChildItemsBox
