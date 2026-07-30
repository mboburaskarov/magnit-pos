import { Box, Grid, Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'
import IncomeIcon from '@icons/IncomeIcon'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'

function MiniDashboard({ cashShiftStat }) {
  const { t } = useTranslation()
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
        title: t('pos.total_register_income'),
        cash: total_cash_amount,
        cashless: total_cashless_amount,
      },
      {
        title: t('pos.register_expenses'),
        cash: total_expense_cash_amount,
        cashless: total_expense_cashless_amount,
      },
      {
        title: t('pos.opened_amount_label'),
        cash: total_opened_cash_amount,
        cashless: total_opened_cashless_amount,
      },
      {
        title: t('pos.current_register_status'),
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
                  backgroundColor: '#1111110D',
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
                <Typography mr={'4px'}>{t('cash')} -</Typography>
                <Typography>{thousandDivider(get(stat, 'cash'), t('pos.currency_short'))}</Typography>
              </Box>
              <Box display={'flex'}>
                <Typography mr={'4px'}>{t('pos.cashless_label')} -</Typography>
                <Typography>{thousandDivider(get(stat, 'cashless'), t('pos.currency_short'))}</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

export default MiniDashboard
