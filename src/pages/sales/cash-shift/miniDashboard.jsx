import React from 'react'
import IncomeIcon from '../../../assets/icons/IncomeIcon'
import { Box, Grid, Typography } from '@mui/material'
import { useQuery } from 'react-query'
import { get } from 'lodash'
import thousandDivider from '../../../../utils/thousandDivider'
function MiniDashboard({ cashShiftStat }) {
  const getMiniStat = ({
    current_cash_amount,
    current_cashless_amount,
    total_cash_amount,
    total_cashless_amount,
    total_expense_cash_amount,
    total_expense_cashless_amount,
    total_opened_cash_amount,
    total_opened_cashless_amount,
  }) => {
    return [
      {
        title: 'Все доходы кассы',
        cash: total_cash_amount,
        cashless: total_cashless_amount,
      },
      {
        title: 'Расходы на кассу',
        cash: total_expense_cash_amount,
        cashless: total_expense_cashless_amount,
      },
      {
        title: 'Открытая сумма',
        cash: total_opened_cash_amount,
        cashless: total_opened_cashless_amount,
      },
      {
        title: 'Текущий статус кассового аппарата',
        cash: current_cash_amount,
        cashless: current_cashless_amount,
      },
    ]
  }
  return (
    <Grid mt={'0px'} spacing={'16px'} container>
      {getMiniStat(get(cashShiftStat, 'data.data', [])).map((stat) => (
        <Grid item sx={6} lg={3} md={6} xs={6}>
          <Box
            sx={{
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #A4A5AB33',
            }}
          >
            <Box
              sx={{
                border: 'none',
                borderBottom: '1px solid #EDEDEE',
                paddingBottom: '12px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  borderRadius: '12px',
                  backgroundColor: '#FF60180D',
                  padding: '10px',
                  width: '40px',
                  height: '40px',
                }}
              >
                <IncomeIcon />
              </Box>
              <Typography
                sx={{
                  lineHeight: '22px',
                  fontWeight: '600',
                  fontSize: '14px',
                  ml: '12px',
                }}
              >
                {get(stat, 'title')}
              </Typography>
            </Box>
            <Box
              sx={{
                paddingTop: '12px',
                '& p': {
                  fontWeight: '600',
                  lineHeight: '23px',
                  fontSize: '16px',
                },
              }}
            >
              <Box display={'flex'}>
                <Typography mr={'4px'}>Наличные -</Typography>
                <Typography>{thousandDivider(get(stat, 'cash'), 'сум')}</Typography>
              </Box>
              <Box display={'flex'}>
                <Typography mr={'4px'}>Безналичный -</Typography>
                <Typography>{thousandDivider(get(stat, 'cashless'), 'сум')}</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

export default MiniDashboard
