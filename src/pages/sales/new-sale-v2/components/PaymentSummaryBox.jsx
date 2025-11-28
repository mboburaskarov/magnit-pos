// components/PaymentSummaryBox.jsx
import { Box, Typography } from '@mui/material'
import { get } from 'lodash'
import thousandDivider from '../../../../../utils/thousandDivider'
import { t } from 'i18next'

export const PaymentSummaryBox = ({ cartItemsList, maxAmount }) => {
  return (
    <Box
      sx={{
        minWidth: '155px',
        width: '100%',
        maxWidth: '380px',
        padding: '8px 12px',
        bgcolor: 'white',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        m: '0 16px',
        '.box-title': {
          fontWeight: '600',
          fontSize: '14px',
          lineHeight: '20px',
          color: 'bunker.500',
        },
        '.box-sum': {
          fontWeight: '600',
          fontSize: '14px',
          lineHeight: '20px',
          color: 'bunker.950',
        },
        '.box-wrapper:last-child > .box-sum': {
          color: 'orange.500',
        },
        '.box-wrapper:not(:last-child)': {
          borderBottom: '1px solid',
          borderColor: 'bunker.100',
        },
      }}
    >
      <SummaryRow title={t('total_amount')} value={thousandDivider(get(cartItemsList, 'total_amount'), 'сум')} />
      <SummaryRow title={t('discount')} value={thousandDivider(get(cartItemsList, 'discount_amount'), 'сум')} />
      <SummaryRow title={t('should_pay')} value={thousandDivider(maxAmount > 0 ? maxAmount : 0, 'сум')} />
      <SummaryRow title={t('return')} value={thousandDivider(maxAmount < 0 ? Math.abs(maxAmount) : 0, 'сум')} />
    </Box>
  )
}

const SummaryRow = ({ title, value }) => (
  <Box className='box-wrapper'>
    <Typography className='box-title'>{title}</Typography>
    <Typography className='box-sum'>{value}</Typography>
  </Box>
)
