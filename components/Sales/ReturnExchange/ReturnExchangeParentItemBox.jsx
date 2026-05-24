import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ArrowRightIcon from '../../../src/assets/icons/ArrowRightIcon'
import BagOutline from '../../../src/assets/icons/BagOutline'
import thousandDivider from '../../../utils/thousandDivider'

const useStyles = makeStyles((theme) => ({
  rightArrowIcon: {
    backgroundColor: '#eff6ff',
    border: '1px solid #2563eb',
    color: '#2563eb',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    transition: 'all 0.15s ease',
    '&:active': {
      backgroundColor: '#dbeafe',
      transform: 'scale(0.95)',
    },
  },
  usrImg: {
    width: '24px',
    borderRadius: '50%',
    marginRight: '4px',
  },
  productsNumsWrapper: {
    height: '48px',
    minWidth: '88px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginRight: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

function ReturnExchangeParentItemBox({ setIsOpenChild, item }) {
  const { t } = useTranslation()
  const classes = useStyles()
  
  return (
    <Box
      onClick={() => setIsOpenChild({ item })}
      display={'flex'}
      height={'84px'}
      borderRadius={'8px'}
      mb={'16px'}
      bgcolor={'bg.10'}
      padding={'18px 16px'}
      justifyContent={'space-between'}
      sx={{
        border: '1px solid #cbd5e1',
        transition: 'background-color 0.15s ease',
        '&:active': {
          backgroundColor: '#eff6ff',
          borderColor: '#2563eb',
        },
      }}
    >
      <Box display={'flex'}>
        <Box className={classes.productsNumsWrapper}>
          <BagOutline />
          <Typography ml={'12px'} fontSize={'16px'} fontWeight={'700'} lineHeight={'24px'} color={'#2563eb'}>
            {get(item, 'product_count')}
          </Typography>
        </Box>
        <Box>
          <Typography mb={'4px'} fontSize={'16px'} fontWeight={'700'} lineHeight={'24px'} color={'bunker.950'}>
            {get(item, 'sale_type') === 'RETURN' ? `Возврат #` : `Продажа #`}
            {get(item, 'sale_number')}
          </Typography>
          <Typography fontSize={'14px'} fontWeight={'500'} lineHeight={'20px'} color={'bunker.500'}>
            {dayjs(get(item, 'completed_at')).format('DD.MM.YYYY | HH:mm:ss')}
          </Typography>
        </Box>
      </Box>
      <Box display={'flex'} alignItems={'center'}>
        <Box mr={'16px'} display={'flex'} flexDirection={'column'} alignItems={'end'}>
          <Box display={'flex'} mb={'4px'}>
            <Typography fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'bunker.950'}>
              {get(item, 'customer_name') == null ? 'Unknown' : get(item, 'customer_name')}
            </Typography>
          </Box>
          <Typography fontSize={'16px'} fontWeight={'700'} lineHeight={'24px'} color={'#2563eb'}>
            {thousandDivider(get(item, 'total_amount'), 'сум')}
          </Typography>
        </Box>
        <Box className={classes.rightArrowIcon}>
          <ArrowRightIcon />
        </Box>
      </Box>
    </Box>
  )
}

export default ReturnExchangeParentItemBox
