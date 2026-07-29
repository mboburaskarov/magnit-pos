import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Printer } from 'lucide-react'
import ArrowRightIcon from '../../../src/assets/icons/ArrowRightIcon'
import BagOutline from '../../../src/assets/icons/BagOutline'
import thousandDivider from '../../../utils/thousandDivider'
import { loadSvgAsEscposHex } from '../../../utils/escposImage'
import { buildReceiptLayout } from '../../../utils/receiptBuilder'

const useStyles = makeStyles((theme) => ({
  rightArrowIcon: {
    backgroundColor: '#f4f5f7',
    border: '1px solid #111217',
    color: '#111217',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    transition: 'all 0.15s ease',
    '&:active': {
      backgroundColor: '#e9ebf0',
      transform: 'scale(0.95)',
    },
  },
  productsNumsWrapper: {
    height: '36px',
    minWidth: '64px',
    backgroundColor: '#ffffff',
    border: '1px solid #e9ebf0',
    borderRadius: '8px',
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

function ReturnExchangeParentItemBox({ setIsOpenChild, item }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const userData = useSelector((state) => state.user)
  const [isPrinting, setIsPrinting] = useState(false)

  const productCount = get(item, 'product_count', 0)
  const customerName = get(item, 'customer_name')
  const hasValidCustomer = customerName && customerName.toLowerCase() !== 'unknown'

  const getPaymentLabel = (el) => {
    const payName = el.payment_type_name || el.payment_type?.name || (typeof el.payment_type === 'string' ? el.payment_type : null)
    if (payName) {
      if (payName.toLowerCase() === 'cash') return 'Наличные'
      if (payName.toLowerCase() === 'card' || payName.toLowerCase() === 'cardless') return 'Карта'
      return payName
    }
    return null
  }
  const paymentLabel = getPaymentLabel(item)

  const handlePrintDuplicate = async (e) => {
    e.stopPropagation()
    if (isPrinting) return
    setIsPrinting(true)

    try {
      const response = await requests.getCashBoxDetaildWithSaleId(item.id)
      const saleData = response?.data?.data
      if (!saleData) {
        throw new Error('No sale data returned')
      }

      let logoHex = null
      try {
        logoHex = await loadSvgAsEscposHex('/MagnitLogoPremiumCheque.svg', 400, 576)
      } catch (logoErr) {
        console.warn('Duplicate logo loading failed:', logoErr)
      }

      const cashierNameStr = `${saleData.employee?.first_name || ''} ${saleData.employee?.last_name || ''}`.trim() || 'Кассир'
      const paymentType = saleData.sale_payments?.[0]?.payment_type?.name?.toLowerCase() || 'cash'
      let kassaNumber = '-'
      try {
        const savedCashbox = JSON.parse(localStorage.getItem('selected_cashbox') || 'null')
        kassaNumber = savedCashbox?.full_name || savedCashbox?.name || '-'
      } catch (e) {
        kassaNumber = '-'
      }

      const payloadData = {
        saleId: String(saleData.sale_number || ''),
        cashier: cashierNameStr,
        kassaNumber,
        paymentType: paymentType,
        isCorporateCard: !!saleData.sale_payments?.[0]?.is_corporate,
        date: saleData.completed_at || new Date().toISOString(),
        items: (saleData.products || []).map((prod) => ({
          name: prod.name || 'Товар',
          mxik: prod.class_code || prod.code || '',
          qty: prod.quantity || 1,
          price: Number(prod.unit_price || 0),
          total: Number(prod.total_price || 0),
          vatPercent: prod.vat_percent || 12,
          vatAmount: prod.vat || 0,
        })),
        discount: Number(saleData.discount_amount || 0),
        totalAmount: Number(saleData.total_amount || 0),
        paidAmount: Number(saleData.total_amount || 0),
        changeAmount: 0,
        vatAmount: Number(saleData.vat_sum || 0),
        chequeType: 'sale',
        fiscalSign: saleData.fiscal_sign || '',
        fiscalNumber: saleData.terminal_id || '',
        fiscalDate: saleData.completed_at || '',
        qrData: saleData.fiscal_sign || '',
        customer: saleData.customer_name || '',
        isDuplicate: true,
      }

      const layoutLines = buildReceiptLayout(payloadData, {
        logoHex,
        name: get(userData, 'store.name'),
        address: get(userData, 'store.address'),
      })
      const reqPayload = {
        lines: layoutLines,
        paymentType: paymentType,
      }

      const printRes = await axios.post('http://localhost:7788/print/raw-template', reqPayload)
      if (printRes.data && printRes.data.ok) {
        return
      }
    } catch (err) {
      console.warn('Silent ESC/POS print failed:', err)
    } finally {
      setIsPrinting(false)
    }
  }

  return (
    <Box
      display={'flex'}
      height={'68px'}
      borderRadius={'8px'}
      mb={'12px'}
      bgcolor={'bg.10'}
      padding={'10px 16px'}
      justifyContent={'space-between'}
      alignItems={'center'}
      sx={{
        border: '1px solid #d5d7e2',
      }}
    >
      <Box display={'flex'} alignItems={'center'}>
        {productCount > 0 && (
          <Box className={classes.productsNumsWrapper}>
            <BagOutline />
            <Typography ml={'8px'} fontSize={'14px'} fontWeight={'700'} color={'#111217'}>
              {productCount}
            </Typography>
          </Box>
        )}
        <Box>
          <Typography mb={'2px'} fontSize={'14px'} fontWeight={'700'} color={'bunker.950'}>
            {get(item, 'sale_type') === 'RETURN' ? `Возврат #` : `Продажа #`}
            {get(item, 'sale_number')}
          </Typography>
          <Typography fontSize={'12px'} fontWeight={'500'} color={'bunker.500'}>
            {dayjs(get(item, 'completed_at')).format('DD.MM.YYYY | HH:mm:ss')}
          </Typography>
        </Box>
      </Box>

      <Box display={'flex'} alignItems={'center'}>
        <Box mr={'16px'} display={'flex'} flexDirection={'column'} alignItems={'end'}>
          {hasValidCustomer && (
            <Typography mb={'2px'} fontSize={'13px'} fontWeight={'600'} color={'bunker.700'}>
              {customerName}
            </Typography>
          )}
          <Box display={'flex'} alignItems={'center'} gap={'8px'}>
            {paymentLabel && (
              <Typography fontSize={'11px'} fontWeight={'500'} color={'bunker.400'} sx={{ bgcolor: '#f1f2f5', px: '6px', py: '2px', borderRadius: '4px' }}>
                {paymentLabel}
              </Typography>
            )}
            <Typography fontSize={'14px'} fontWeight={'700'} color={'#111217'}>
              {thousandDivider(get(item, 'total_amount'), 'сум')}
            </Typography>
          </Box>
        </Box>

        <Box
          onClick={handlePrintDuplicate}
          sx={{
            backgroundColor: '#f1f3f7',
            border: '1px solid #e5e7eb',
            color: '#6f6f6f',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            marginRight: '8px',
            opacity: isPrinting ? 0.6 : 1,
            '&:hover': {
              backgroundColor: '#e5e7eb',
              color: '#111217',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <Printer size={16} />
        </Box>

        <Box
          className={classes.rightArrowIcon}
          onClick={(e) => {
            e.stopPropagation()
            setIsOpenChild({ item })
          }}
          sx={{ cursor: 'pointer' }}
        >
          <ArrowRightIcon />
        </Box>
      </Box>
    </Box>
  )
}

export default ReturnExchangeParentItemBox
