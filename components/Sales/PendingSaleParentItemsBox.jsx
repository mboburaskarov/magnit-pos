import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ArrowRightIcon from '../../src/assets/icons/ArrowRightIcon'
import thousandDivider from '@utils/thousandDivider'

const useStyles = makeStyles((theme) => ({
  rightArrowIcon: {
    backgroundColor: '#eff6ff',
    border: '1px solid #2563eb',
    color: '#2563eb',
    width: '36px',
    height: '36px',
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
}))

const getProductCountText = (count, lng) => {
  if (lng === 'uz') {
    return `${count} ta mahsulot`
  }
  if (lng === 'en') {
    return `${count} item${count !== 1 ? 's' : ''}`
  }
  // Russian pluralization fallback
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} товаров`
  }
  if (lastDigit === 1) {
    return `${count} товар`
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} товара`
  }
  return `${count} товаров`
}

function PendingSaleParentItemsBox({ setIsOpenChild, item }) {
  const { t, i18n } = useTranslation()
  const currentLang = i18n?.language || 'ru'
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

  const productCount = get(item, 'product_count', 0)
  const customerName = get(item, 'customer_name') || [get(item, 'customer.first_name'), get(item, 'customer.last_name')].filter(Boolean).join(' ').trim()
  const hasValidCustomer = customerName && customerName.toLowerCase() !== 'unknown'

  return (
    <Box
      onClick={() => setIsOpenChild({ item, type: 'sale' })}
      display={'flex'}
      height={'68px'}
      borderRadius={'8px'}
      mb={'12px'}
      bgcolor={'bg.10'}
      padding={'10px 16px'}
      justifyContent={'space-between'}
      alignItems={'center'}
      sx={{
        border: '1px solid #cbd5e1',
        transition: 'all 0.15s ease',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#f8fafc',
        },
        '&:active': {
          backgroundColor: '#eff6ff',
          borderColor: '#2563eb',
        },
      }}
    >
      <Box display={'flex'} flexDirection={'column'}>
        <Typography mb={'2px'} fontSize={'14px'} fontWeight={'700'} color={'bunker.950'}>
          {t('pending_sales')} #{get(item, 'sale_number')}
        </Typography>
        <Box display="flex" alignItems="center" gap="8px">
          <Typography fontSize={'12px'} fontWeight={'500'} color={'bunker.500'}>
            {dayjs(get(item, 'created_at')).format('DD.MM.YYYY | HH:mm:ss')}
          </Typography>
          <Typography fontSize={'11px'} fontWeight={'500'} color={'bunker.500'} sx={{ display: 'inline-flex', alignItems: 'center', gap: '3px', bgcolor: '#f1f5f9', px: '6px', py: '2px', borderRadius: '4px' }}>
            ⏱️ {elapsed}
          </Typography>
        </Box>
      </Box>

      <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'13px'} fontWeight={'600'} color={'bunker.600'}>
          {getProductCountText(productCount, currentLang)}
        </Typography>
      </Box>

      <Box display={'flex'} alignItems={'center'}>
        <Box mr={'16px'} display="flex" flexDirection="column" alignItems="end">
          {hasValidCustomer && (
            <Typography mb={'2px'} fontSize={'13px'} fontWeight={'600'} color={'bunker.700'}>
              {customerName}
            </Typography>
          )}
          <Typography fontSize={'14px'} fontWeight={'700'} color={'#2563eb'}>
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
