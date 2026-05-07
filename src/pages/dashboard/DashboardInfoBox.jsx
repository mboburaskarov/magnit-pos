import { Box, Button, Skeleton, Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'
import { requests } from '@utils/requests'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import RightArrowIcon from '@/assets/icons/RightArrowIcon'

export default function DashboardInfoBox({
  noDot,
  ind,
  title,
  icon,
  count: countProp,
  amount: amountProp,
  percent: percentProp,
  id,
  old,
  endText,
  withoutDivider,
  dashboard_filter,
  action,
  ...l
}) {
  const isSaleBox = ['sale_amount', 'sale_count'].includes(id)
  const isLoyaltyBox = ['total_loyalty_card_count', 'total_loyalty_card_balance', 'today_created_loyalty_card_count'].includes(id)
  const isNetProfit = ['income_amount', 'production_cost'].includes(id)
  const isImport = ['import_amount', 'not_last_24h_import_amount'].includes(id)
  const isProduct = [
    'total_product_count',
    'stock_total_amount',
    'expiring_soon_count',
    'expired_soon_count',
    'expiring_soon_amount',
    'expired_soon_amount',
  ].includes(id)
  const isEmployee = id === 'bonus_amount'
  const isTarget = id === 'target_amount'

  const queryKey =
    (isSaleBox && ['sale_stats', dashboard_filter]) ||
    (isLoyaltyBox && ['loyalty_card_stats', dashboard_filter]) ||
    (isNetProfit && ['net_profit_stats', dashboard_filter]) ||
    (isImport && ['import_stats', dashboard_filter]) ||
    (isProduct && ['product_stats', dashboard_filter]) ||
    (isEmployee && ['employee_stats', dashboard_filter]) ||
    (isTarget && ['target_stats', dashboard_filter]) ||
    null

  const { data: countStats, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (isSaleBox) return requests.dashboradSaleStatistic(dashboard_filter)
      if (isLoyaltyBox) return requests.dashboradLoyaltyStatistic(dashboard_filter)
      if (isNetProfit) return requests.dashboradNetProfitStatistic(dashboard_filter)
      if (isImport) return requests.dashboradImportStatistic(dashboard_filter)
      if (isProduct) return requests.dashboradProductStatistic(dashboard_filter)
      if (isEmployee) return requests.dashboradEmployeeStatistic(dashboard_filter)
      if (isTarget) return requests.dashboardTargetStatistic(dashboard_filter)
      throw new Error('Unknown id')
    },
    enabled: !!queryKey,
  })
  const count = countStats?.data?.data?.[countProp]
  const before = countStats?.data?.data?.old
  const amount = countStats?.data?.data?.[amountProp]
  const percent = percentProp?.(before, count)
  const isFall = percent < 0
  const income = countStats?.data?.data?.income_amount
  const total = countStats?.data?.data?.income_amount + countStats?.data?.data?.production_cost
  const totalWithoutNDS = total - total * 0.12
  const incomePercentWithNDS = ((income / total) * 100).toFixed(1)
  const incomePercent = ((income / totalWithoutNDS) * 100).toFixed(3)
  return (
    <Box sx={{ border: 1, borderRadius: '16px', borderColor: '#A4A5AB33', minHeight: '154px', width: '100%' }}>
      <Box key={ind} sx={{ p: '20px', height: '164px', m: 0 }}>
        <Box width='100%' alignItems='start' flexDirection='column' display='inline-flex'>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {!noDot && <Box height={'48px'}>{isLoading ? <Skeleton variant='circular' width={48} height={48} sx={{ borderRadius: '12px' }} /> : icon}</Box>}
            {action && (
              <Button
                onClick={() => action(count, amount)}
                sx={{
                  borderRadius: '50px',
                  ml: '8px',
                  p: '9px 0px',
                  height: '36px',
                  width: '36px',
                  backgroundColor: 'white !important',
                  color: 'orange.500',
                  fontSize: '14px',
                  borderColor: 'orange.500',
                  '& svg': {
                    flexShrink: 0,
                  },
                }}
                color='secondary'
              >
                <RightArrowIcon />
              </Button>
            )}
          </Box>
          <Box flex={1}>
            {isLoading ? (
              <Skeleton variant='rectangular' width='65%' height={20} sx={{ mt: '16px', borderRadius: '6px' }} />
            ) : (
              <Typography display='flex' alignItems={'center'} fontSize='14px' fontWeight='500' lineHeight='20px' color='bunker.500' mt='16px'>
                {title} {id === 'target_amount' ? `(Ежемесячно - ${thousandDivider(amount, '')} сум)` : ''}
                {(id === 'expiring_soon_amount' || id === 'expired_soon_amount') && (
                  <Typography
                    sx={{
                      padding: '3px 8px 1px',
                      borderRadius: '16px',
                      backgroundColor: 'bunker.100',
                      fontWeight: '500',
                      fontSize: '12px',
                      ml: '8px',
                      lineHeight: '16px',
                      color: 'bunker.500',
                    }}
                  >
                    {withoutDivider ? count : thousandDivider(count, '')} шт
                  </Typography>
                )}
                {id == 'income_amount' && (
                  <>
                    <Typography
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',

                        padding: '3px 8px 3px',
                        borderRadius: '16px',
                        backgroundColor: 'bunker.100',
                        fontWeight: '700',
                        fontSize: '12px',
                        ml: '8px',
                        lineHeight: '16px',
                        color: 'bunker.500',
                      }}
                    >
                      cНДС: {thousandDivider(incomePercentWithNDS, '%')}
                    </Typography>
                    <Typography
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',

                        padding: '3px 8px 3px',
                        borderRadius: '16px',
                        backgroundColor: 'bunker.100',
                        fontWeight: '700',
                        fontSize: '12px',
                        ml: '8px',
                        lineHeight: '16px',
                        color: 'bunker.500',
                      }}
                    >
                      {thousandDivider(incomePercent, '%')}
                    </Typography>
                  </>
                )}
              </Typography>
            )}
          </Box>
        </Box>

        <Box mt={icon ? '0px' : 0} width='100%' justifyContent='space-between' alignItems='center' display='inline-flex'>
          <Box flex={1}>
            {isLoading ? (
              <Skeleton variant='rectangular' width='55%' height={40} sx={{ borderRadius: '8px' }} />
            ) : (
              <Typography
                alignItems='center'
                display='flex'
                color='dark.500'
                fontSize='28px'
                lineHeight='40px'
                fontWeight='700'
                variant='h1'
                sx={{
                  '& > p': {
                    fontSize: '28px',
                    lineHeight: '40px',
                    fontWeight: '700 !important',
                    color: 'dark.500',
                  },
                }}
              >
                {withoutDivider ? thousandDivider(Math.round(amount), endText) : <Typography>{thousandDivider(Math.round(count), endText)}</Typography>}
                {/* {id.includes('loyalty_card') && (
                  <Link to={'/clients/all?tab=loyalty-cards'}>
                    <Button
                      sx={{
                        borderRadius: '50px',
                        ml: '8px',
                        p: '9px 0px',
                        height: '30px',
                        backgroundColor: 'white !important',
                        color: 'orange.500',
                        fontSize: '14px',
                        borderColor: 'orange.500',
                        '& svg': {
                          flexShrink: 0,
                        },
                      }}
                      color='secondary'
                    >
                      <RightArrowIcon />
                    </Button>
                  </Link>
                )} */}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* <Box key={ind} sx={{ py: '18px', px: '20px', height: '52px', m: 0, borderTop: 1, borderColor: '#A4A5AB33' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {percent < 1000 && (
            <>
              {isLoading ? (
                <Skeleton variant='rectangular' width={65} height={26} sx={{ borderRadius: '16px' }} />
              ) : (
                <Box
                  display='inline-flex'
                  sx={{
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '3px 8px 1px',
                    backgroundColor: !isFall ? '#30BE821F' : '#FF46393D',
                  }}
                  alignItems='center'
                >
                  <Typography color={isFall ? '#FF4639' : '#30BE82'} fontWeight='500' fontSize={12} lineHeight='16px'>
                    {!isFall ? '+' : ''} {percent}%
                  </Typography>
                </Box>
              )}
            </>
          )}
          <Box sx={{ ml: '10px' }}>
            {isLoading ? (
              <Skeleton variant='rectangular' width={140} height={16} sx={{ borderRadius: '6px' }} />
            ) : (
              <Typography color='bunker.500' fontSize='12px' lineHeight='16px' fontWeight='500' variant='h1'>
                {thousandDivider(old)} {endText} за прошедший период
              </Typography>
            )}
          </Box>
        </Box>
      </Box> */}
    </Box>
  )
}
