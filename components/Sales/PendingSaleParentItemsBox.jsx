import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ArrowRightIcon from '../../src/assets/icons/ArrowRightIcon'
import BagOutline from '../../src/assets/icons/BagOutline'
import thousandDivider from '@utils/thousandDivider'
import CustomImg from '../CustomImg'
const useStyles = makeStyles((theme) => ({
  rightArrowIcon: {
    backgroundColor: '#fff ',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  usrImg: {
    width: '24px',
    borderRadius: '50%',
    marginRight: '4px',
  },
  productsNumsWrapper: {
    height: '48px',
    minWidth: '88px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    marginRight: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))
function PendingSaleParentItemsBox({ setIsOpenChild, item }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const [elapsed, setElapsed] = useState('')

  useEffect(() => {
    const updateTimer = () => {
      const created = get(item, 'created_at')
      if (!created) return
      const diffMs = new Date() - new Date(created)
      if (diffMs < 0) {
        setElapsed('00:00')
        return
      }
      const diffSecs = Math.floor(diffMs / 1000)
      const secs = diffSecs % 60
      const mins = Math.floor(diffSecs / 60) % 60
      const hours = Math.floor(diffSecs / 3600)
      
      const pad = (num) => String(num).padStart(2, '0')
      if (hours > 0) {
        setElapsed(`${pad(hours)}:${pad(mins)}:${pad(secs)}`)
      } else {
        setElapsed(`${pad(mins)}:${pad(secs)}`)
      }
    }
    
    updateTimer()
    const timerId = setInterval(updateTimer, 1000)
    return () => clearInterval(timerId)
  }, [item])

  return (
    <Box
      onClick={() => setIsOpenChild({ item, type: 'sale' })}
      display={'flex'}
      height={'84px'}
      borderRadius={'16px'}
      mb={'16px'}
      bgcolor={'bg.10'}
      padding={'18px 16px'}
      justifyContent={'space-between'}
      sx={{
        '&:hover': {
          backgroundColor: 'gray.200',
        },
      }}
    >
      <Box display={'flex'}>
        <Box className={classes.productsNumsWrapper}>
          <BagOutline />
          <Typography ml={'12px'} fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'orange.500'}>
            {get(item, 'product_count')}
          </Typography>
        </Box>
        <Box>
          <Typography mb={'4px'} fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'bunker.950'}>
            {t('pending_sales')} #{get(item, 'sale_number')}
          </Typography>
          <Box display="flex" alignItems="center" gap="10px">
            <Typography fontSize={'14px'} fontWeight={'500'} lineHeight={'20px'} color={'bunker.500'}>
              {dayjs(get(item, 'created_at')).format('DD.MM.YYYY | HH:mm:ss')}
            </Typography>
            <span style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '1px 5px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '4px', fontWeight: 'bold' }}>
              ⏱️ {elapsed}
            </span>
          </Box>
        </Box>
      </Box>
      <Box display={'flex'}>
        <Box mr={'16px'}>
          <Box display={'flex'} mb={'4px'}>
            {/* <CustomImg className={classes.usrImg} src='default-user-img.png' /> */}
            <Typography fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'bunker.950'}>
              {get(item, 'customer.first_name') == null ? 'Unknown' : get(item, 'customer.first_name')}
            </Typography>
          </Box>
          <Typography fontSize={'16px'} fontWeight={'600'} lineHeight={'24px'} color={'orange.500'}>
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

export default PendingSaleParentItemsBox
