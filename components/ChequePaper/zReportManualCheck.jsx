import { Box, Divider, Typography } from '@mui/material'
import { get } from 'lodash'
import React from 'react'
import { useSelector } from 'react-redux'
import thousandDivider from '../../utils/thousandDivider'

function ZReportManualCheck({ data, printContainer }) {
  console.log(data)
  const userData = useSelector((state) => state.user)

  const Row = ({ label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
      <Typography fontWeight={'600'}>{label}</Typography>
      <Typography fontWeight={'600'}>{value}</Typography>
    </Box>
  )

  return (
    <Box
      maxWidth='400px'
      sx={{
        display: 'none',
        width: '355px',
        overflowY: 'scroll',
        maxHeight: '75vh',
      }}
    >
      <Box
        mx={-2}
        mt={'-3px'}
        style={{
          padding: '20px',
        }}
        ref={printContainer}
      >
        {/* Body */}
        <Box
          width={'100%'}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            justifyContent: 'start',
            flexDirection: 'column',
            height: '72px',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Typography variant='h6' align='center' gutterBottom>
              {get(data, 'filter.store_name', '')}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant='subtitle1' fontWeight='bold'>
                Отчет продаж
              </Typography>
              <Row label='Пользователь:' value={`${get(userData, 'first_name', '')} ${get(userData, 'last_name', '')}`} />
              <Row label='Дата:' value={`${get(data, 'filter.start_date', '')} - ${get(data, 'filter.end_date', '')}`} />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant='subtitle1' fontWeight='bold'>
                Транзакций
              </Typography>
              <Row label='Продаж:' value={`${get(data, 'data.total_count', 0)} `} />
              <Row label='Сумму:' value={`${thousandDivider(get(data, 'data.total_transactions_sum', 0))} сум`} />
              <Row label='Возвратов:' value={`${get(data, 'data.total_returnals_count', 0)}`} />
              <Row label='Сумму:' value={`${thousandDivider(get(data, 'data.total_returnals_sum', 0))} сум`} />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant='subtitle1' fontWeight='bold'>
                Товары
              </Typography>
              <Row label='Продано товаров:' value={get(data, 'data.total_product_count')} />
              <Row label='Возвращено товаров:' value={get(data, 'data.total_returnals_count')} />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant='subtitle1' fontWeight='bold'>
                Касса
              </Typography>
              {get(data, 'data.payment_type_stats', []).map((item) => {
                if (item.sum > 0) {
                  return <Row key={item.name} label={item.name} value={`${thousandDivider(item.sum)} UZS`} />
                } else {
                  return null
                }
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight={'600'} fontStyle='italic' mt={2}>
              Отчет сформирован и напечатан в PharmaCosmos
            </Typography>
          </Box>
        </Box>
        {/* Body */}
      </Box>
    </Box>
  )
}
export default ZReportManualCheck
